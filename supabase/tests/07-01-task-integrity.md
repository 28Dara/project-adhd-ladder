# 07-01 · Verificación pendiente de ejecución

Ejecutar únicamente con autorización en un Supabase de pruebas, con identidades desechables y sin datos reales. Ninguna de estas comprobaciones se ha ejecutado contra PostgreSQL. 07-02 completará la verificación de aislamiento con dos cuentas del servicio de autenticación.

## Precondiciones y orden de aplicación

1. Confirmar el historial de migraciones del entorno y la versión efectiva de PostgreSQL. Aplicar esta versión de la tercera migración solo donde `20261124000000` aún no esté registrada. Si ya se aplicó, detenerse y preparar una migración correctiva autorizada. El rol de migración debe poder crear el rol escritor, asumirlo para transferirle funciones y acceder a Auth para los auxiliares. Las columnas booleanas siguientes deben ser verdaderas. El escritor solo utiliza los auxiliares y carece de acceso directo a esos datos.

```sql
select current_user,
       current_setting('server_version') as server_version,
       (select rolcreaterole or rolsuper from pg_roles where rolname = current_user) as can_create_role,
       has_schema_privilege(current_user, 'auth', 'USAGE') as auth_usage,
       has_column_privilege(current_user, 'auth.users', 'id', 'SELECT') as auth_id,
       has_column_privilege(current_user, 'auth.users', 'created_at', 'SELECT') as auth_signup,
       to_regcollation('pg_catalog."und-x-icu"') is not null as unicode_collation;
```

2. Aplicar las migraciones en orden `20261123000000`, `20261123000100`, `20261124000000` con la API de datos cerrada a clientes durante toda la cadena. La segunda concede permisos directos que la tercera revoca. Confirmar que `adhd_ladder_private` queda fuera de los esquemas expuestos. Mantener cerradas las llamadas de escritura al terminar 07-01.
3. Antes de habilitar funciones para los casos funcionales en el entorno desechable, comprobar que `anon` y `authenticated` carecen de ejecución sobre las cinco funciones públicas y de permisos de escritura sobre tareas, completaciones y Health, incluidas las concesiones por columna. Verificar que `authenticated` puede editar el nombre del perfil propio sin escribir `write_time_zone`. Comprobar que el rol escritor carece de inicio de sesión, de capacidad para omitir RLS, de propiedad de las cuatro tablas y de acceso directo a Auth.
4. Para la prueba funcional desechable, conceder temporalmente a `authenticated` el uso del esquema interno y ejecución solo en los cinco pares de funciones (públicas e internas). Mantener cerradas las funciones auxiliares. Usar una sesión autenticada de prueba con las RPC públicas o reproducirla con el rol `authenticated` y la identidad de prueba en la conexión administrativa local. Verificar al finalizar que esas concesiones de prueba quedan retiradas. Bajo aislamiento distinto de `READ COMMITTED`, esperar `read_committed_required`.

Ejecutar las siguientes consultas antes de las concesiones temporales y repetirlas tras retirarlas. Se esperan diez filas de RPC públicas con `can_execute = false` e `is_definer = false`. Los retornos deben ser `tasks` para creación, renombrado y retiro, `boolean` para completaciones y `health_checks` para Health. La consulta de escrituras y la del rol escritor deben devolver solo `false` en las columnas booleanas.

```sql
select client.role_name, p.oid::regprocedure as rpc,
       pg_get_function_result(p.oid) as result_type, p.prosecdef as is_definer,
       has_function_privilege(client.role_name, p.oid, 'EXECUTE') as can_execute
from pg_proc as p
cross join (values ('anon'), ('authenticated')) as client(role_name)
where p.pronamespace = 'public'::regnamespace
  and p.proname in ('create_task', 'rename_task', 'archive_task', 'set_task_completion', 'set_health_goal');

select client.role_name, target.table_name,
       has_any_column_privilege(client.role_name, target.table_name, 'INSERT, UPDATE')
         or has_table_privilege(client.role_name, target.table_name, 'DELETE, TRUNCATE') as can_write
from (values ('anon'), ('authenticated')) as client(role_name)
cross join (values ('public.tasks'), ('public.task_completions'), ('public.health_checks')) as target(table_name);

select has_schema_privilege('authenticated', 'adhd_ladder_private', 'USAGE') as private_schema_open,
       has_column_privilege('authenticated', 'public.profiles', 'write_time_zone', 'INSERT, UPDATE') as can_set_zone;

select client.role_name, p.oid::regprocedure as private_function
from pg_proc as p
cross join (values ('anon'), ('authenticated')) as client(role_name)
where p.pronamespace = 'adhd_ladder_private'::regnamespace
  and has_function_privilege(client.role_name, p.oid, 'EXECUTE');

select has_column_privilege('authenticated', 'public.profiles', 'display_name', 'UPDATE') as can_update_name;

select r.rolcanlogin, r.rolbypassrls, r.rolsuper, r.rolinherit,
       has_schema_privilege(r.oid, 'adhd_ladder_private', 'CREATE') as can_create_private,
       has_any_column_privilege(r.oid, 'auth.users', 'SELECT') as can_read_auth_users,
       exists (select 1 from pg_class c where c.relowner = r.oid and c.relkind = 'r') as owns_tables
from pg_roles r
where r.rolname = 'adhd_ladder_writer';

select relname, relrowsecurity
from pg_class
where oid in ('public.profiles'::regclass, 'public.tasks'::regclass,
              'public.task_completions'::regclass, 'public.health_checks'::regclass);
```

`private_schema_open` y `can_set_zone` también deben ser falsos. La consulta de ejecución sobre funciones privadas debe devolver cero filas. `can_update_name` y las cuatro filas de `relrowsecurity` deben ser verdaderos. Corroborar en `pg_policies` que las cuatro tablas tienen una política para `adhd_ladder_writer` por identidad de Auth y en `pg_proc` que las cinco funciones privadas de escritura pertenecen al escritor, tienen `SECURITY DEFINER` y fijan el `search_path` vacío. En las cinco entradas públicas comprobar `SECURITY INVOKER` y el mismo `search_path`.

## Retorno de Health y compatibilidad de zonas

En la sesión de prueba autenticada, reemplazar `YYYY-MM-DD` y `America/Mexico_City` por el día vigente y la zona del caso. Empezar con una cuenta sin fila de Health en esa fecha. Ejecutar ambas consultas por separado y esperar `true` y `0`, respectivamente. `IS NOT DISTINCT FROM NULL` comprueba el valor compuesto completo y distingue un nulo SQL de un compuesto con todos sus campos nulos.

```sql
select public.set_health_goal('nutrition', false, 'YYYY-MM-DD', 'America/Mexico_City')
       is not distinct from null::public.health_checks as is_sql_null;

select count(*) as health_rows
from public.health_checks
where user_id = auth.uid() and date = 'YYYY-MM-DD'::date;
```

Repetir con `true` y luego actualizar una meta en la fila existente. Usar la RPC como expresión (`SELECT public.set_health_goal(...)`) para inspeccionar el compuesto completo. Registrar por separado el estado HTTP, el cuerpo JSON y la forma de `data` de una llamada autenticada a la RPC vía Supabase en el entorno desechable. PostgREST puede expandir el tipo compuesto al serializarlo. El nulo SQL por sí solo no determina si el cliente recibirá `null`, una colección u otra representación. Confirmar también el retorno booleano de completación y los registros de tarea de las otras RPC.

En los navegadores objetivo, ejecutar `Intl.DateTimeFormat().resolvedOptions().timeZone` en DevTools y guardar el texto exacto. Usar ese texto y candidatos representativos en esta consulta. Algunos alias dependen de las versiones de ICU y tzdata. Probar al menos una entrada sin barra distinta de `UTC` que exista en el catálogo.

```sql
select candidate.name, exists (
  select 1 from pg_catalog.pg_timezone_names as tz
  where tz.name collate pg_catalog."C" = candidate.name
) as is_recognized_name
from (values ('America/Mexico_City'), ('UTC'), ('GMT'), ('CET'),
             ('Asia/Calcutta'), ('Etc/GMT+5'), ('+05:30'),
             ('EST5EDT,M3.2.0,M11.1.0'), ('Unknown/Zone'), ('utc'), (null)) as candidate(name);
```

En cada zona reconocida, usar una cuenta de prueba sin referencia previa. Para obtener el día esperado en una sesión de prueba, ejecutar `SET LOCAL TIME ZONE '<nombre>'` dentro de una transacción y consultar `clock_timestamp()::date`. La RPC debe aceptar ese día y fijar el nombre enviado como referencia. Para los desplazamientos explícitos, expresiones POSIX arbitrarias, nombres desconocidos, variantes sin coincidencia exacta y nulo, esperar `invalid_device_time_zone` y confirmar que el perfil, la referencia y Health quedan como estaban.

Si `CET` existe en el catálogo, comprobar el cruce de día que produce la zona nombrada en verano. El ejemplo debe dar `2026-07-02` en `named_day`. Con las abreviaturas por defecto de PostgreSQL 17, la interpretación de `timezone('CET', ...)` devuelve `2026-07-01` al usar UTC+01:00. Este segundo valor permite detectar la diferencia, pero puede depender de la configuración del servidor.

```sql
begin;
set local time zone 'CET';
select timestamptz '2026-07-01 22:30:00+00'::date as named_day,
       timezone('CET', timestamptz '2026-07-01 22:30:00+00')::date as abbreviation_day;
rollback;
```

Para comprobar el alcance de `TimeZone`, llamar a la RPC con una zona distinta de la zona de la sesión y consultar `current_setting('TimeZone')` antes y después. Repetir con una fecha posterior al alta que falle por no coincidir con el día de la zona declarada. Usar un punto de retorno para poder consultar la configuración tras el error dentro de la misma transacción. En ambos casos, la zona de la sesión debe conservar su valor inicial.

## Parámetros de prueba

Usar `D` como el día actual calculado en la zona `Z` y enviar el texto `YYYY-MM-DD`. Usar fechas de alta reales de las identidades de prueba. Para los casos con histórico, usar una identidad con alta anterior al día histórico, preparar una marca de ayer como dato de prueba mediante la conexión administrativa y registrar las filas iniciales. Preparar los escenarios de cardinalidad y bloqueo en cuentas o escaleras independientes.

| Caso | Pasos reproducibles | Resultado esperado |
|---|---|---|
| Datos inválidos y alta | Enviar `today`, `2026-02-30`, una zona inexistente y una fecha anterior al día local de alta. Probar además fecha futura y booleano nulo. | `invalid_local_date`, `invalid_device_time_zone`, `date_before_registration`, `device_local_date_mismatch` o error de estado requerido, según el caso. Cero escrituras. |
| Referencia sin perfil | Con una identidad sin perfil, realizar una operación fechada inválida. Luego marcar una meta válida y repetir desde otra zona con el mismo día. Repetir el flujo con un perfil previo cuyo nombre ya está guardado. | El fallo no crea perfil ni referencia. La primera operación exitosa fija la referencia una sola vez y el nombre existente se conserva. La presencia del perfil no certifica siembra. |
| Reloj, zona y dispositivos | Fijar la referencia y usar otra zona cuyo día calculado difiera. Enviar el día de esa segunda zona. Repetir con una fecha adelantada o atrasada respecto de ambas. | `account_local_date_mismatch` para el día válido del otro dispositivo, `device_local_date_mismatch` cuando la fecha no coincide con su zona. La referencia y los datos se conservan. |
| Cambio de horario | En un entorno desechable, comprobar con `timezone` que `2026-03-08 06:59:00+00` y `2026-03-08 07:01:00+00` en `America/New_York` corresponden al mismo día local a pesar del salto de hora. Programar el caso integrado con la base de zonas del entorno y probar la aceptación de la fecha local durante ese día. | Ambos instantes corresponden a `2026-03-08`. Las escrituras autorizadas se agrupan por día calendario. |
| Petición cruzando medianoche | Fijar la zona. Antes de medianoche, en A abrir una transacción y realizar una escritura válida sin confirmar. En B iniciar una RPC con la fecha capturada ese día y verificar que espera. Confirmar A después de medianoche. | B rechaza la fecha anterior después de adquirir el bloqueo, sin registrar la fecha nueva ni tocar el histórico. Una petición nueva con la fecha nueva funciona. |
| Completación idempotente | En una tarea propia activa, llamar dos veces con `true` y consultar sus filas por fecha. Llamar dos veces con `false`. | Primero una sola fila de hoy. Después cero filas de hoy y la marca histórica conservada. |
| Renombrado y normalización | Crear con espacios, primera letra minúscula y resto en mayúsculas mixtas. Incluir un primer carácter Unicode que se expanda al convertir a mayúsculas, como `ß`. Con marcas de ayer y hoy, confirmar primero un nombre normalizado equivalente y luego otro distinto. | Normalización coherente con el frontend, mismo identificador y escalera. El equivalente conserva las dos marcas, el efectivo quita únicamente la de hoy. |
| Retiro | Retirar una tarea marcada hoy y otra desmarcada en escenarios con más de una activa. Intentar renombrar, archivar de nuevo y marcar las retiradas. | Las filas permanecen con `archived_at` y el historial de ayer sigue intacto. Las operaciones ordinarias posteriores se rechazan. |
| Reversión | En una transacción administrativa de prueba, instalar un disparador temporal sobre `task_completions` que falle al borrar la marca de la tarea de prueba. Crear un punto de retorno, invocar renombrado efectivo o retiro con la marca de hoy presente, volver al punto de retorno y consultar ambas tablas. Repetir para ambas operaciones. Al final revertir la transacción de prueba. | Sin cambios en título, `archived_at`, completaciones ni en una posible inicialización de referencia. |
| Cardinalidad concurrente | Crear desde cero. Con tres activas, mantener en A una creación válida en transacción abierta e iniciar otra en B. Confirmar A. Con dos activas, repetir el patrón retirando tarjetas distintas. | La creación inicial funciona. La segunda alta falla con `active_task_limit` y quedan cuatro. El segundo retiro falla con `last_active_task` y queda una. |
| Carrera sobre una tarea | Ejecutar retiro en A sin confirmar y luego marcación o renombrado de esa tarea en B. Confirmar A. Repetir en orden inverso con marcación en A. | B comprueba el estado nuevamente. Si el retiro ocurrió primero, rechaza la otra operación. Si marcó primero, el retiro elimina la marca de hoy. |
| Health sin fila, desmarcar | En una fecha vigente sin fila, invocar `set_health_goal('nutrition', false, D, Z)` y consultar el total de filas de esa cuenta y fecha. | Nulo SQL y cero filas. Una primera operación fechada válida puede fijar la referencia según DEC-07-04. |
| Health sin fila, marcar | Invocar `set_health_goal('nutrition', true, D, Z)` para la misma cuenta y día. | Devuelve la única fila creada con Nutrition en `true` y Sleep y Movement en `false`. |
| Health con fila | Marcar Sleep y Movement en esa fila. En otra llamada desmarcar Nutrition y comparar el retorno y la fila almacenada. | Conserva usuario y fecha. Nutrition queda en `false` y las otras dos metas siguen en `true`. |
| Health concurrente | En una cuenta sin fila para D, escribir `nutrition = true` en A sin confirmar y `sleep = true` en B para la misma cuenta y fecha. Confirmar A, luego B. Desmarcar únicamente `nutrition`. Intentar editar ayer. | Una fila con ambos valores. La desmarcación conserva Sleep y el historial de ayer no cambia. |
| Desmarcación concurrente en Health | Con una cuenta sin fila para D, marcar Nutrition en A sin confirmar. En B desmarcar Sleep para la misma cuenta y fecha. Confirmar A, luego B. | B espera y devuelve la fila que dejó A, con Nutrition en `true` y Sleep en `false`. |
| Privilegios | Como `authenticated` y `anon`, revisar permisos de tabla y columna e intentar las operaciones ordinarias excluidas y una llamada a un auxiliar, solo en el entorno desechable. Como propietario de un perfil, editar el nombre y comparar la zona antes y después. | Escrituras directas y llamadas auxiliares rechazadas. Se conserva edición del nombre propio y no cambia la zona. El rol escritor continúa sujeto a RLS. |

## Revisión manual del propietario

- Consultar `profiles` antes y después de la primera escritura válida. Debe aparecer la zona esperada sin cambiar un nombre previo.
- Consultar `tasks` y `task_completions` después de un cambio efectivo de nombre y un retiro. Deben mantenerse los identificadores y el histórico, y desaparecer solo las marcas de hoy.
- Revisar el resultado de las dos sesiones para el máximo de cuatro y el mínimo de una. La fila de Health debe conservar ambos objetivos independientes.
- Comparar el retorno compuesto de Health con el conteo de filas y con el cuerpo HTTP. Registrar las zonas devueltas por los navegadores y verificar su presencia en el catálogo.
- Confirmar el rechazo de una solicitud tardía y de las escrituras directas. Una fila histórica modificada, permisos adicionales o un conteo fuera de los límites bloquean la habilitación de escrituras.
