# 07-01 · Verificación pendiente de ejecución

Ejecutar únicamente con autorización en un Supabase de pruebas, con identidades desechables y sin datos reales. Ninguna de estas comprobaciones se ha ejecutado contra PostgreSQL. 07-02 completará la verificación de aislamiento con dos cuentas del servicio de autenticación.

## Precondiciones y orden de aplicación

1. Confirmar el historial del entorno y la versión efectiva de PostgreSQL. Verificar que el rol de migración puede crear un rol sin inicio de sesión, asignarle funciones y leer exclusivamente `id` y `created_at` de Auth en las funciones internas. Los siguientes resultados deben ser verdaderos. `und-x-icu` es la intercalación Unicode que utiliza la normalización del título.

```sql
select current_user,
       has_schema_privilege(current_user, 'auth', 'USAGE') as auth_usage,
       has_column_privilege(current_user, 'auth.users', 'id', 'SELECT') as auth_id,
       has_column_privilege(current_user, 'auth.users', 'created_at', 'SELECT') as auth_signup,
       to_regcollation('pg_catalog."und-x-icu"') is not null as unicode_collation;
```

2. Aplicar las migraciones en orden `20261123000000`, `20261123000100`, `20261124000000` con la API de datos cerrada a clientes durante toda la cadena. La segunda concede permisos directos que la tercera revoca. Confirmar que `adhd_ladder_private` queda fuera de los esquemas expuestos. Mantener cerradas las llamadas de escritura al terminar 07-01.
3. Antes de habilitar funciones para los casos funcionales en el entorno desechable, comprobar que `anon` y `authenticated` carecen de ejecución sobre las cinco funciones públicas y de permisos de escritura sobre tareas, completaciones y Health, incluidas las concesiones por columna. Verificar que `authenticated` puede editar el nombre del perfil propio sin escribir `write_time_zone`. Comprobar que el rol escritor carece de inicio de sesión, de capacidad para omitir RLS, de propiedad de las cuatro tablas y de acceso directo a Auth.
4. Para la prueba funcional desechable, conceder temporalmente a `authenticated` el uso del esquema interno y ejecución solo en los cinco pares de funciones (públicas e internas). Mantener cerradas las funciones auxiliares. Usar una sesión autenticada de prueba con las RPC públicas o reproducirla con el rol `authenticated` y la identidad de prueba en la conexión administrativa local. Verificar al finalizar que esas concesiones de prueba quedan retiradas. Bajo aislamiento distinto de `READ COMMITTED`, esperar `read_committed_required`.

Estas consultas de catálogo se pueden usar para comprobar el estado inicial, antes de esas concesiones de prueba. Las tres columnas de escritura y acceso deben ser falsas. En la segunda consulta, los tres atributos del rol deben ser falsos y el conteo de tablas propias debe ser cero.

```sql
select has_function_privilege('authenticated', 'public.create_task(text,text)', 'EXECUTE') as rpc_open,
       has_any_column_privilege('authenticated', 'public.tasks', 'UPDATE') as task_update,
       has_column_privilege('authenticated', 'public.profiles', 'write_time_zone', 'UPDATE') as zone_update;

select r.rolcanlogin, r.rolbypassrls, r.rolsuper,
       (select count(*) from pg_class c where c.relowner = r.oid and c.relkind = 'r') as owned_tables
from pg_roles r
where r.rolname = 'adhd_ladder_writer';
```

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
| Health concurrente | Escribir `nutrition = true` en A sin confirmar y `sleep = true` en B para la misma cuenta y fecha. Confirmar A, luego B. Desmarcar únicamente `nutrition`. Intentar editar ayer. | Una fila con ambos valores. La desmarcación conserva Sleep y el historial de ayer no cambia. |
| Privilegios | Como `authenticated` y `anon`, revisar permisos de tabla y columna e intentar las operaciones ordinarias excluidas y una llamada a un auxiliar, solo en el entorno desechable. Como propietario de un perfil, editar el nombre y comparar la zona antes y después. | Escrituras directas y llamadas auxiliares rechazadas. Se conserva edición del nombre propio y no cambia la zona. El rol escritor continúa sujeto a RLS. |

## Revisión manual del propietario

- Consultar `profiles` antes y después de la primera escritura válida. Debe aparecer la zona esperada sin cambiar un nombre previo.
- Consultar `tasks` y `task_completions` después de un cambio efectivo de nombre y un retiro. Deben mantenerse los identificadores y el histórico, y desaparecer solo las marcas de hoy.
- Revisar el resultado de las dos sesiones para el máximo de cuatro y el mínimo de una. La fila de Health debe conservar ambos objetivos independientes.
- Confirmar el rechazo de una solicitud tardía y de las escrituras directas. Una fila histórica modificada, permisos adicionales o un conteo fuera de los límites bloquean la habilitación de escrituras.
