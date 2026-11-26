# ADHD Ladder — Dossier integral v2.3

> **Documento normativo del producto · 25 de noviembre de 2026.** Consolida la arquitectura aprobada para el MVP académico, la rúbrica de Etapa 1 y los ajustes de alcance. La lógica de contadores de v2.2 sigue vigente.
>
> **Precedencia de decisiones:** instrucción explícita más reciente del propietario > decisiones `[DECIDIDO]` de este dossier > plan de trabajo > propuestas `[PROP]`. Los puntos `[ABIERTO]` no autorizan implementaciones especulativas. El historial conserva su valor histórico, pero no sustituye las reglas vigentes.

**Producto:** ADHD Ladder · **Entrega:** proyecto final TripleTen, Etapa 1. **Stack:** React, TypeScript, Vite, React Router, Node.js, Express, Supabase Auth, PostgreSQL con RLS, `@supabase/supabase-js` y DummyJSON mediante Fetch nativo.

**Fecha de corte:** 25/11/2026 · **Plazo oficial:** 30/11/2026 · **Objetivo de entrega:** PR `stage-frontend` → `main` el 28 o 29/11. El calendario vigente está en el plan de trabajo.

## Qué cambió en v2.3 [DECIDIDO]

- Arquitectura `client/` y `server/` basada en Around. Express es la API de datos privados, con lógica de aplicación en TypeScript y garantías de integridad en PostgreSQL.
- Entrada por `/` según sesión y alias privado `/life`. Ambas vistas de Life comparten el estado de cuenta.
- DummyJSON conserva su comportamiento en memoria de la sesión. La persistencia de frases 07-08 pasa al trabajo posterior al MVP.
- El proyecto existente de Supabase Cloud es el destino académico. La propuesta SQL de §03 requiere aceptación de sus ajustes y autorización de ejecución. Las reglas de §§02.2–02.8 permanecen vigentes hasta que se apruebe un cambio explícito.

---

## 01 · Producto y propósito

ADHD Ladder es una aplicación web de hábitos y progreso personal que convierte pequeñas acciones en escalones visibles. El usuario organiza sus metas en **Health, Activities y Learning** y observa progreso diario y acumulado en **Life**, con la metáfora de una escalera y un personaje. El diseño debe ser claro, amable y manejable.

### Problema y público

Las herramientas de productividad pueden convertir las metas en listas largas y abstractas. La propuesta es mostrar acciones concretas y reconocer avances pequeños, sin prometer eficacia terapéutica. El nombre ADHD Ladder **no implica diagnóstico, tratamiento ni eficacia clínica**. Health refleja metas autodeclaradas, no el estado médico de la persona.

### Propuesta de valor

- Acciones breves y tarjetas fáciles de marcar, añadir y gestionar.
- Áreas reconocibles y progreso diario diferenciado del histórico.
- Retroalimentación visual con paleta crema, verde y naranja; tipografías Patrick Hand y Kalam según el sistema de estilos existente.
- Experiencia accesible, responsive y consistente entre las pantallas privadas.

### Pantallas

| Pantalla | Contenido y función | Alcance vigente |
|---|---|---|
| Landing (`/`, sin sesión) | Logo, navegación pública, escalera, CTA hacia registro | Diseño aprobado |
| Sign Up / Log In | Email/contraseña, navegación de retorno, autenticación Supabase | Rutas públicas |
| Life (`/` con sesión o `/life`) | Hoy, total histórico, racha, días desde alta, secciones Health/Activities/Learning, frase del día | Privada. Life = Activities + Learning |
| Health (`/health`) | Semáforo textual y tres objetivos fijos | Privada; no suma pasos |
| Activities (`/activities`) | Tareas activas, pasos de hoy, total histórico, añadir y gestionar | Privada; máximo cuatro activas |
| Learning (`/learning`) | Mismas reglas de tareas y contadores que Activities | Privada; máximo cuatro activas |
| About (`/about`) | Misión del producto y presentación del autor | Pública |
| Popups | Edición de nombre, menú de tareas, diálogo de añadir, confirmaciones, tooltips | UI implementada. Alta persistente pendiente |

Las cuatro escaleras comparten criterios visuales, pero **no** necesariamente la misma maquetación interna. Las páginas públicas mantienen sus propios márgenes. Diseño responsive a partir de 320 px; consultar mockups y CSS existente para detalles.

### Alcance y prioridades

**[DECIDIDO] Propósito al 25 de noviembre de 2026.** MVP académico y pieza de portafolio para un grupo pequeño de usuarios de demostración. La aplicación debe cumplir la rúbrica, mostrar una implementación funcional y permitir que la desarrolladora mantenga y defienda sus decisiones en una entrevista. Express expone la API de la aplicación y usa el proyecto existente de Supabase Cloud para identidad y datos. La operación remota requiere su autorización correspondiente.

| Capa de alcance | Qué comprende |
|---|---|
| Requisitos académicos | Rúbrica oficial de TripleTen Etapa 1. Ver §04 para su resumen, la API real mediante `fetch()`, el README, el despliegue recargable y el enlace al PR. |
| Producto esencial | Auth, aislamiento por cuenta con RLS, tareas y completaciones por día, archivo con historial, progreso derivado, Health y los flujos aprobados que los sostienen. |
| Comportamiento adicional aprobado | Racha, antigüedad, tareas iniciales y frase de sesión según §§02.6–02.10. |
| Mejoras opcionales | Pulido cosmético y controles adicionales justificados por evidencia. El plan conserva los pendientes P2. |
| Fuera del MVP | Operación comercial, pruebas de carga, Docker, WSL, Supabase CLI, MongoDB, JWT propio, analítica clínica e historial de frases entre sesiones y dispositivos. |

Priorizar la conformidad académica y una versión demostrable con seguridad e integridad verificadas. Mantener las decisiones de producto del capítulo 02 hasta que el propietario autorice un cambio concreto.

---

## 02 · Especificación funcional y lógica

### 02.1 Rutas, sesión y seguridad

`/` muestra Landing sin sesión y Life con sesión, tras completar la restauración. `/about` es pública. `/signup` y `/login` son para visitantes y mantienen la redirección a `/life` para sesiones activas. `/life`, `/health`, `/activities` y `/learning` requieren sesión y, sin ella, redirigen a `/login`. El cierre exitoso vuelve a `/`. Life en `/` y `/life` usa el mismo layout privado y estado de cuenta que las demás escaleras.

React Router gobierna navegación. La API autentica cada petición privada y PostgreSQL aplica RLS con esa identidad. Una llamada HTTP puede llegar sin pasar por React. Restaurar sesión con Supabase Auth en el `AuthProvider` existente.

### 02.2 Definiciones normativas de los contadores [DECIDIDO]

**Paso:** una completación válida de una tarea de **Activities o Learning** para una fecha calendario local concreta. Una tarea puede aportar como máximo **un paso por día**, aunque se marque repetidamente.

**Fecha local actual (`todayLocalDate`):** `YYYY-MM-DD` calculado con la fecha local del navegador. La misma referencia se usa en las vistas de progreso. La propuesta de §03 llevaría las vistas y escrituras al calendario fijo de la cuenta tras su aprobación.

**Pasos de hoy (`Your steps today`):** número de completaciones de **hoy**; puede subir y bajar al marcar/desmarcar. No es la cantidad de tarjetas creadas ni la cantidad total de hábitos configurados.

**Total histórico (`Your total steps`):** número de completaciones de **fechas estrictamente anteriores a hoy**. No incluye ninguna completación de la fecha actual. Los totales no cambian al marcar o desmarcar hoy.

**Tarjetas activas:** tareas actualmente disponibles para marcar. El máximo es cuatro en Activities y cuatro en Learning. El número de tarjetas activas no define el histórico. Si se muestra una fracción de progreso, su denominador corresponde a las tareas activas de la escalera; **no** confundirlo con `Your total steps`.

### 02.3 Fórmulas únicas de progreso [DECIDIDO]

Para cada completación válida `c`, `c.completed_date` es una fecha local `YYYY-MM-DD` y la tarea asociada pertenece a Activities o Learning.

```text
activitiesToday = nº de completaciones de Activities con completed_date === todayLocalDate
learningToday   = nº de completaciones de Learning   con completed_date === todayLocalDate
lifeToday       = activitiesToday + learningToday

activitiesTotal = nº de completaciones de Activities con completed_date < todayLocalDate
learningTotal   = nº de completaciones de Learning   con completed_date < todayLocalDate
lifeTotal       = activitiesTotal + learningTotal
```

**Interpretación de las SectionCards de Life:** la sección My Activities muestra `activitiesToday`; la sección Learning muestra `learningToday`; Life muestra la suma **de esos números**. Si Learning registra tres pasos, aporta tres, no un solo paso por existir una SectionCard.

**Health nunca aporta pasos** a estas fórmulas. Los contadores históricos incluyen completaciones de días cerrados, independientemente de si las tarjetas originales siguen visibles.

**Evitar dobles fuentes de verdad:** calcular estos valores desde completaciones fechadas. No crear una columna acumulada ni un estado de total persistido independiente salvo decisión arquitectónica posterior explícita. No debe ejecutarse una función de suma exactamente a medianoche.

### 02.4 Operación de las casillas [DECIDIDO]

1. **Marcar hoy:** registrar una sola completación de esa tarea en la fecha actual; el contador diario de su escalera aumenta en uno. La sección de Life y `lifeToday` se actualizan con el nuevo número; los históricos no cambian.
2. **Desmarcar hoy:** revertir la completación de esa tarea **solo para hoy**; su contador diario disminuye en uno y Life refleja la resta. Los registros de fechas anteriores permanecen intactos.
3. **No duplicar:** una misma tarea marcada varias veces en la misma fecha cuenta como máximo una vez. El contador nunca puede ser negativo.
4. **Cambio de día:** cada casilla se determina por la presencia de una completación de **la nueva fecha**. Si no existe, se muestra desmarcada, aunque la misma tarea se completara ayer. Todos los contadores diarios comienzan en cero si nadie registró pasos para ese nuevo día.
5. **Histórico por fechas:** al convertirse ayer en una fecha anterior a hoy, sus completaciones pasan **lógicamente** al total histórico. No borrar, copiar ni trasladar necesariamente esos registros.
6. **Aplicación cerrada:** si la persona no abre la app durante varios días, la próxima consulta debe producir los mismos números, sin incrementar varias veces un total almacenado.
7. **Cuentas distintas:** únicamente se cuentan completaciones del usuario autenticado; nunca las de otra cuenta.

**Precisión temporal:** el histórico es relativo a la fecha local de consulta, no una cifra que se actualice por un proceso nocturno. Cambios posteriores en zona horaria deben manejarse coherentemente, sin reinterpretar silenciosamente fechas ya guardadas; los escenarios de cambio manual de reloj o zona horaria requieren pruebas adicionales, no una nueva regla inventada.

**DEC-07-01 [DECIDIDO] · Fecha local.** Las operaciones fechadas conservan el día calendario local del dispositivo y preservan la sincronización de lectura y escritura corregida en AUD-02-01. Se validan en SQL según DEC-07-04. La interfaz sigue sin configuración de zona horaria y la fecha UTC no sustituye el día local.

**DEC-07-02 [DECIDIDO] · Integridad temporal.** Rechazar registros fechados antes del alta. Usar la fecha real de registro de Supabase Auth según el contrato de fecha local y proteger los días cerrados. Al persistir un renombrado efectivo o un retiro, confirmar o revertir juntos el cambio de la tarjeta y la eliminación exclusiva de su completación de hoy, conforme a §02.6.

**DEC-07-04 [DECIDIDO] · Referencia fija de escritura.** La primera operación fechada exitosa fija para la cuenta la zona horaria detectada y declarada por el dispositivo. Durante el MVP se conserva esa referencia sin selector ni modificación posterior. La fecha capturada al realizar cada acción debe coincidir con el día que PostgreSQL calcula con su reloj tanto en la zona declarada como en la referencia fija. La referencia también determina la fecha local de alta real y protege los días cerrados. Si los días no coinciden, la escritura se rechaza sin trasladarla automáticamente a otro día. Esto puede impedir temporalmente escribir desde dispositivos con días locales distintos. PostgreSQL comprueba la coherencia de la fecha declarada, pero no puede certificar de forma independiente la ubicación ni la zona real del dispositivo.

**Compatibilidad de zonas [DECIDIDO].** Admitir los identificadores de zona horaria que devuelven los navegadores, previa revisión técnica de su compatibilidad con PostgreSQL. La implementación debe respetar las comprobaciones de DEC-07-04.

### 02.5 Ejemplo vinculante: lunes → martes [DECIDIDO]

Histórico anterior al lunes: Activities 8, Learning 12, Life 20.

| Momento | Activities hoy | Learning hoy | Life hoy | Activities total | Learning total | Life total |
|---|---:|---:|---:|---:|---:|---:|
| Lunes, antes de marcar | 0 | 0 | 0 | 8 | 12 | 20 |
| Lunes, marca 1 de Activities | 1 | 0 | 1 | 8 | 12 | 20 |
| Lunes, desmarca esa tarea | 0 | 0 | 0 | 8 | 12 | 20 |
| Lunes, marca 3 de Learning | 0 | 3 | 3 | 8 | 12 | 20 |
| Martes, sin nuevos checks | 0 | 0 | 0 | 8 | 15 | 23 |

**Lectura:** el lunes, las tres marcas de Learning son progreso diario y **no** elevan Life total de 20. El martes, esas mismas tres completaciones ya son históricas, de modo que Life total es 23 y Life hoy es cero. No hubo transferencia física de datos. Si se desmarcara una de las tres tareas **antes de que termine el lunes**, el martes el histórico aumentaría solo dos.

### 02.6 Integridad del historial y gestión de tareas [DECIDIDO]

- Una tarea pertenece a una escalera (Activities o Learning) y puede completarse una vez por día.
- **[DECIDIDO] Nombre al confirmar:** al crear o renombrar con Submit, se aplica `trim()` y se convierte el primer carácter a mayúscula conservando el resto del texto tal como se escribió. Se rechaza un nombre que quede vacío. El borrador conserva el texto escrito.
- **[DECIDIDO] Renombrado efectivo:** si el nombre normalizado cambia respecto del confirmado, se conservan el ID, la escalera y el propietario. En la misma operación se elimina solo la completación de esa tarea para la fecha local actual, si existe. En ese caso, Today disminuye un paso en la escalera correspondiente y en Life. El histórico permanece intacto. Si se confirma el mismo nombre normalizado o la tarea ya está desmarcada, los contadores se mantienen. Cancel, Escape, clic exterior y envíos inválidos dejan intactas las completaciones.
- Cuentas nuevas reciben **una sola vez** las tareas de ejemplo: Activities — Gym, Read my Book, Guitar Practice; Learning — Learned something new, Studied a language, Studied music theory. No recrearlas automáticamente si el usuario las retira.
- Se permiten hasta **cuatro tareas activas por escalera**. Cuando queda una, Settings oculta **Delete Card** y la operación rechaza su retiro. La vista admite un estado vacío si ocurre por carga, error, importación o datos preexistentes.
- **[DECIDIDO] Retiro mediante `archived_at`.** Confirmar **Delete Card** registra la fecha de archivado, conserva la tarea con su ID, propietario y escalera y la quita de la lista activa. El retiro preserva el registro físico y las completaciones históricas. La confirmación de 06B-05 aplica al estado en memoria.
- **[DECIDIDO] Completación de hoy al retirar.** En la misma actualización que establece `archived_at`, se elimina solo la completación de esa tarea de la fecha local actual, si existe. Today baja un paso en su escalera y en Life cuando la tarjeta estaba marcada. Total permanece intacto. Cancel, Escape y el clic exterior conservan la tarjeta y sus completaciones.
- Las archivadas quedan fuera del límite de tareas activas y se mantienen disponibles para contar el historial. Las operaciones ordinarias de marcar, renombrar y retirar requieren una tarea activa. Una tarjeta nueva recibe un ID propio, aunque su nombre coincida con el de una archivada. La restauración queda fuera del alcance.

### 02.7 Health — regla B [DECIDIDO]

Health tiene exactamente tres objetivos diarios fijos: **Good Nutrition, Good Sleep y Daily Movement**. Se marcan por fecha, con toda la tarjeta como área clicable. Sus marcas **no** suman pasos a ninguna escalera. Sus checkboxes están vacíos para la nueva fecha si aún no se registraron checks de ese día.

**Escritura de un objetivo [DECIDIDO].** Si todavía no hay fila diaria y se solicita `false`, devolver `null` y dejar el día sin fila.

El semáforo **se calcula**, no se persiste como un valor independiente:

| Ayer | Hoy | Estado mostrado |
|---|---|---|
| Cualquiera | 3 casillas | Verde |
| Cualquiera | 1–2 casillas | Amarillo |
| Al menos 1 casilla | 0 casillas | Amarillo |
| 0 casillas | 0 casillas | Rojo |
| Primer día de la cuenta, sin día anterior | 0 casillas | Amarillo |

La fecha nueva **no obliga** a mostrar rojo. Cada estado usa color **y texto**, sin diagnóstico ni valoración médica. El indicador de Health en Life es un círculo semántico, no un check de paso.

### 02.8 Racha [DECIDIDO]

La racha se evalúa por **días cerrados**; mientras hoy no termina, se muestra la racha calculada hasta ayer. **No confundir la racha con `lifeTotal` ni con días desde el alta.**

- Un día con al menos un paso en Activities o Learning suma un día a la racha.
- Sin pasos, Health verde o amarillo **y** el día anterior tuvo pasos: la racha se mantiene, sin sumar.
- Sin pasos, si el día anterior tampoco tuvo pasos: la racha se reinicia, aunque Health sea verde.
- Sin pasos con Health rojo: la racha se reinicia.

Los casos límite deben comprobarse según estas condiciones; no modificar esta lógica al ajustar los contadores. **Días en la escalera** = días calendario transcurridos desde el registro, contando el primero; no es la racha.

### 02.9 Modelo de datos [PROP — sujeto a migraciones y pruebas reales]

| Tabla o concepto | Campos clave propuestos | Responsabilidad / precaución |
|---|---|---|
| `profiles` | `id` (FK `auth.users`), `display_name`, `created_at`, `write_time_zone`; metadatos de alta y siembra propuestos en §03 | Perfil y referencia de cuenta. El nombre visible del Header se edita en sesión. |
| `tasks` | `id`, `user_id`, `ladder` (`activities`/`learning`), `title`, `archived_at`, `created_at` | Identidad estable de tarea, estado activo/retirado; Health no usa esta tabla |
| `task_completions` | `id`, `user_id`, `task_id`, `completed_date` | Fuente de pasos diarios e históricos; `UNIQUE(task_id, completed_date)`; FK compuesta para impedir referencias de otra cuenta |
| `health_checks` | `user_id`, `date`, `nutrition`, `sleep`, `movement` | Una fila por fecha y persona; no cuenta como pasos |
| Derivados, **sin tabla propia** | `today`, `total`, estado Health, racha, días desde alta | Se calculan de registros y fecha de consulta; no se guardan como verdad duplicada |

**Integridad crítica:** el retiro mediante `archived_at` debe preservar los registros históricos asociados. Mantener las claves foráneas y la protección RLS al conectar la persistencia. Se prohíbe el borrado físico de tareas como mecanismo de retiro.

Las fechas se almacenan como días calendario `YYYY-MM-DD` según fecha local del usuario. No usar conversión UTC automática para decidir a qué día pertenece un check. La aplicación no está limitada a una zona horaria fija.

### 02.10 Quotes API — requisito externo de Etapa 1

Supabase guarda cuentas y datos personales, pero **no sustituye** la API de frases de terceros. Una API pública real debe consumirse mediante `fetch()` en `src/utils/quotesApi.ts`, con respuesta verificada y tipada, transformación al tipo interno `Quote`, carga, error con reintento y estado vacío.

**Proveedor [DECIDIDO]** — DummyJSON, mediante `https://dummyjson.com/quotes/random`. Se consulta directamente desde el navegador, sin credenciales ni datos de cuenta. La respuesta debe contener `id` numérico, `quote` y `author` de texto. La aplicación conserva el texto original y lo muestra como texto plano. Se verifica CORS (intercambio de recursos entre orígenes) desde el navegador.

**Interacción aprobada** — Si la fecha local carece de frase asignada, Life muestra «Today's quote for you is...» y «Click to reveal». Solo se solicita una frase a DummyJSON al pulsar el botón. Al revelarla, desaparecen título y botón y se muestra solo la frase. Se conservan los estados de carga, error, vacío y reintento. Las respuestas de otro día o cuenta se descartan.

**Prevención de repeticiones [DECIDIDO]** — Comparar cada frase recibida con las revelaciones exitosas de la cuenta durante hoy y los seis días calendario locales anteriores. Se considera repetición si coincide el identificador o el texto al ignorar mayúsculas, minúsculas y espacios redundantes. Conservar el texto original al mostrarlo. Solicitar alternativas de forma secuencial y mantener la carga hasta obtener una frase válida y diferente o alcanzar cinco solicitudes totales por intento. Si las cinco se repiten, informar y permitir un reintento manual. Una frase revelada hace siete días o más vuelve a ser elegible.

**[DECIDIDO] Alcance del MVP.** La frase y la ventana de comparación se mantienen en memoria de la sesión privada. Recargar, cerrar sesión o cambiar de cuenta reinicia esa memoria. DEC-07-03 y 07-08 quedan aplazados para después de la entrega. DummyJSON y su gestión de errores siguen en el navegador.

### 02.11 Estado, persistencia y accesibilidad

- Mantener el estado compartido de las rutas privadas y los borradores en React. Tareas, completaciones y Health persisten en Supabase a través de Express. Los hooks usan utilidades tipadas y los componentes se encargan de la presentación.
- Funciones puras para fechas, progreso, Health y racha. UI consistente en Life/Activities/Learning desde la misma fuente de completaciones por usuario y fecha.
- RLS en todas las tablas personales, verificada con dos cuentas; controlar carrera de solicitudes, respuestas antiguas tras cambio de cuenta y reversión de actualizaciones optimistas fallidas.
- Accesibilidad: `button`, `a`, `label`, teclado, foco visible, estados de carga/error, indicadores de color acompañados de texto, popups cerrables y formularios con validación.
- Responsive a partir de 320 px sin desbordamiento horizontal; no ocultar overflow como remedio para fallos de maquetación.

---

## 03 · Tecnologías, arquitectura y diseño

### Stack y referencia [DECIDIDO]

- El cliente usa Vite, React, TypeScript y React Router, con CSS, Grid/Flex, normalize y tokens de color propios.
- El servidor usa Node.js y Express con TypeScript. Supabase Auth gestiona las credenciales y emite los tokens. Supabase JS conecta con Auth y PostgreSQL mediante la Data API con RLS.
- DummyJSON se consume con Fetch nativo desde el navegador.
- La referencia oficial es [Around, rama `main` inspeccionada en `5d7db78`](https://github.com/28Dara/web_project_around_full/tree/5d7db784f0443a4c9f72a6b24515f2b217c5fe67). Sus tres `package.json` separan cliente y servidor. `client/src/utils/api.ts` centraliza Fetch. En el servidor, `app.ts` compone middleware y rutas, `routes/index.ts` monta recursos, los controladores orquestan operaciones, `types/express/index.d.ts` tipa el contexto y `utils/errors.ts` construye errores HTTP. Los modelos de Around pertenecen a Mongoose. Aquí se usa Supabase JS y solo se añade `models/` si hay una responsabilidad de datos real. Supabase Auth asume las responsabilidades que Around resolvía con contraseñas y JWT propios.

### Separación de responsabilidades [DECIDIDO]

| Capa | Responsabilidad |
|---|---|
| React | Presentación, formularios, navegación, sesión Supabase, borradores y estado privado compartido. Los hooks llaman a Express para datos privados. Las funciones puras existentes calculan fechas, progreso, Health y racha. |
| Express | Enrutamiento y controladores TypeScript. Verifica identidad, valida cuerpos, UUID, fechas, zona y valores, normaliza títulos, orquesta lecturas y escrituras, adapta filas a respuestas tipadas y traduce errores. |
| PostgreSQL | Tablas, relaciones, RLS, restricciones, permisos mínimos, escritura fechada autorizada y las transacciones imprescindibles. Persiste datos fuente de progreso e historial. |
| DummyJSON | Provee la frase pública. El cliente realiza la solicitud independiente y conserva la UX de §02.10. |

**Acceso privado.** React toma el token vigente del `AuthProvider` y lo envía como `Authorization: Bearer …`. El middleware de Express lo verifica con `supabase.auth.getUser(token)`. Deriva `user.id` del resultado y rechaza campos de identidad en el cuerpo. Para las consultas crea un SDK por petición con la clave publicable y el mismo Bearer, sin persistencia ni refresco de sesión del lado servidor. Las consultas incluyen el propietario donde corresponda y RLS aplica `auth.uid()` también frente al acceso directo a la Data API. Las operaciones de datos del usuario se ejecutan con su identidad, sin `service_role`. Supabase Auth conserva todas sus responsabilidades de registro, login y logout. [Verificación del usuario](https://supabase.com/docs/reference/javascript/auth-getuser) · [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security).

### Organización objetivo [DECIDIDO]

```text
project-adhd-ladder/
  client/
    src/                         # conserva las carpetas actuales
    public/
    index.html
    package.json
    tsconfig*.json
    vite.config.ts
    .env.example
  server/
    src/
      app.ts
      controllers/
      middleware/
      routes/
        index.ts
      types/
      utils/
    package.json
    tsconfig.json
    .env.example
  supabase/migrations/
  docs/
  .agents/
  AGENTS.md
  package.json
  README.md
  .gitignore
```

El frontend vive en el workspace `client/` con su entrada HTML, assets, configuración y ejemplo de entorno. Conserva sus módulos internos bajo `client/src/`. El lockfile de npm y las migraciones permanecen en la raíz.

La base de 07-EXP vive en el workspace `server/`. `src/app.ts` inicia Express y monta el router de `src/routes/index.ts` bajo `/api`. `src/middleware/error-handler.ts` y `src/utils/errors.ts` definen las respuestas de error JSON. En desarrollo, Vite reenvía `/api` al puerto configurado mediante `PORT`, con `3000` como valor predeterminado. Ambos procesos leen el puerto del entorno o de `server/.env`.

### Implementación y despliegue [PROP]

- **Paquetes y comandos.** Mantener manifiestos y TypeScript independientes. Usar workspaces nativos de npm y lockfile de raíz para que `npm install` incluya ambos paquetes desde el punto de entrada académico. Reusar las dependencias actuales del cliente. En el servidor, `express` y `@supabase/supabase-js` en ejecución. En desarrollo, TypeScript, `tsx`, `@types/node`, `@types/express` y las herramientas ESLint/Prettier existentes. Coordinar dos procesos de desarrollo con `concurrently` en la raíz a partir de la fundación del servidor. Mantener `npm run dev`, `npm run build`, `npm run lint` y `npm run format:check` en la raíz.
- **Entorno y publicación.** Usar la misma convención que ya lee el cliente, `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY` en el entorno de `client/`. El servidor recibe `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` y `PORT`. Usar carga de entorno nativa de Node para desarrollo y variables del alojamiento al publicar. Ignorar todas las variantes de entorno reales y versionar ejemplos ficticios. Verificar paths de configuración, variables de compilación, instalación y artefactos al mover carpetas. No se encontró configuración de alojamiento en el árbol actual.
- **Un origen HTTPS.** En desarrollo Vite reenvía `/api` a Express. En el alojamiento Node, Express sirve `client/dist` y monta `/api` antes de los estáticos. Las rutas de la SPA tienen fallback a `index.html` para navegación GET, con exclusión de la API, archivos estáticos inexistentes y métodos de mutación. La API devuelve sus propios 404 JSON. Verificar URLs de sitio y redirección de Supabase Auth con ese origen. La elección del alojamiento se confirma en 07-11.
- **Errores y datos privados.** Estandarizar errores JSON del API. Usar 400 para entrada inválida, 401 para token ausente o inválido, 404 para recurso propio inexistente o no visible, 409 para reglas en conflicto y 503 si Auth o datos están indisponibles. Limitar el cuerpo JSON, evitar cachear respuestas privadas y omitir tokens, credenciales y datos personales de los logs.

| REST propuesto | Responsabilidad |
|---|---|
| `GET /api/healthz` | Estado de arranque del proceso. Respuesta pública sin datos de cuenta. |
| `POST /api/account/bootstrap` | Recibir `timeZone` al iniciar por primera vez. Inicializar de forma idempotente y devolver `registeredAt` y la zona de cuenta. |
| `GET /api/tasks` | Obtener tareas y completaciones del propietario, incluidas archivadas para el histórico. Leer con Supabase JS y paginar internamente si la API limita filas. |
| `POST /api/tasks` | Validar escalera, normalizar título, crear y devolver la tarea confirmada. |
| `PATCH /api/tasks/:taskId` | Recibir `title` y `date`. Renombrar una tarea activa y devolver la tarea confirmada y si se retiró su marca. |
| `DELETE /api/tasks/:taskId?date=YYYY-MM-DD` | Retirar una tarea activa sin borrado físico. Devolver la tarea confirmada y si se retiró su marca. |
| `PUT /api/tasks/:taskId/completions/:date` | Recibir `completed: boolean`. Aplicar el estado deseado del día, idempotente ante reintentos. |
| `GET /api/health` | Leer checks propios para Health y racha, con paginación interna si procede. |
| `PUT /api/health/:date/:goal` | Recibir `completed: boolean`. Cambiar solo el objetivo indicado y devolver la fila confirmada o `null` según §02.7. |

**Reuso React.** Conservar `AuthProvider`, `PrivateLayout`, `useLadderSession`, `useTasks`, `useHealth`, las funciones puras de `dates`, `progress` y `health`, y las páginas y popups actuales. `useRegistrationDate` usa la fecha real de Auth en la zona aprobada para persistencia. Incorporar un cliente Fetch tipado para Express junto a las utilidades existentes. Hidratar por cuenta, esperar la confirmación de escrituras, preservar borradores ante fallos y descartar respuestas tardías al cambiar de cuenta. Mantener el nombre editable del Header y las frases en sesión. Para las frases se conserva el calendario del navegador.

### Diseño SQL mínimo y cambios de contrato [PROP]

La cadena local `20261123000000`, `20261123000100` y `20261124000000` crea las cuatro tablas personales de §02.9, establece RLS y configura escrituras. La segunda concede DML directo a `authenticated` y la tercera revoca las escrituras de tareas, marcas y Health. La tercera añade `write_time_zone`, el rol escritor y cinco pares de funciones con ejecución pública revocada a clientes. Esto es evidencia del código. El estado efectivo de Cloud se comprueba por separado.

| Mecanismo | Decisión propuesta y consecuencia |
|---|---|
| Tablas, propiedad e historial | Conservar `profiles`, `tasks`, `task_completions` y `health_checks`. Usar FK a Auth, FK compuesta tarea/propietario, unicidad tarea/fecha y clave Health cuenta/fecha. Mantener RLS, lecturas propias directas vía SDK, `archived_at` y la prohibición de borrado físico ordinario. Los totales, la racha y el semáforo se derivan. |
| Inicialización única | Añadir un marcador de siembra a `profiles` separado de su existencia. Una transacción crea o bloquea el perfil, fija la zona si hace falta, inserta las seis tareas fijas solo para una cuenta sin actividad previa y marca el éxito. Los reintentos devuelven los metadatos existentes. Con datos previos, conservar filas y solo reconciliar el marcador y referencias verificadas. Siembra y escrituras ordinarias comparten la misma puerta de integridad. |
| Límite y última tarjeta | Retener las reglas de cuatro activas y mínimo de una al retirar. Contar bajo el lock del perfil en las operaciones SQL de alta y retiro. Evitar columnas de contador, posiciones artificiales y un preconteo remoto desde Express. |
| Títulos | Normalizar en TypeScript con `trim()` y mayúscula inicial, conservando el resto. Sustituir el normalizador SQL con ICU por una restricción de texto no vacío, incluida la presencia exclusiva de whitespace. En SQL, comparar el título recibido con el almacenado dentro de la transacción para decidir si hay cambio efectivo. **Cambio propuesto:** el formato canónico lo ofrece la API Express. Una llamada directa autorizada a la RPC sobre una tarea de su cuenta podría guardar una variante no canónica, con las mismas restricciones de propiedad e historial. |
| Fecha y zona | **Cambio propuesto a DEC-07-01/04:** fijar la zona IANA detectada al inicializar la cuenta, o conservar la ya registrada. Usar esa zona para Today, fecha real del alta y escrituras en todos los dispositivos. Mantener la captura de fecha al actuar de AUD-02-01. PostgreSQL verifica la fecha contra el reloj y zona de cuenta tras adquirir el lock, rechaza fechas cerradas o anteriores al alta y conserva fechas existentes. En cambios de zona del dispositivo, prevalece el calendario de la cuenta. Si la solicitud cruza medianoche se rechaza y la UI refresca el día para reintento explícito. Validar zonas de navegador en TypeScript y sus equivalentes de catálogo en PostgreSQL. Pasar un parámetro PostgreSQL `date` y retirar el parser textual duplicado. La garantía de DEC-07-02 se conserva. |
| Archivo, edición y completaciones | Mantener operaciones atómicas. Archivar o renombrar efectivamente borra solo la marca de la fecha autorizada en la misma transacción. Marcar usa la clave única con inserción idempotente, desmarcar borra la fila del mismo día. La tarea debe seguir activa. Un renombrado sin cambio deja la marca intacta. |
| Health | Mantener una fila por cuenta y fecha y escribir exclusivamente la columna del objetivo pedido con actualización atómica. Conservar `false` sobre un día sin fila como `null`, el corte de fechas y la independencia de objetivos. Calcular la regla B y la racha en React. |
| Roles, esquema y RPC | Conservar un único rol escritor sin login ni bypass de RLS y un esquema de implementación sin exposición en la Data API. Mantener envoltorios públicos `SECURITY INVOKER` mínimos solo para siembra y cinco mutaciones protegidas. Otorgar solo los permisos necesarios sobre esos puntos de entrada y sus funciones internas, con `search_path` fijo, identidad de `auth.uid()` y privilegios por operación/columna. Revocar DML ordinario de tablas y ejecución de auxiliares. Este límite evita que un usuario omita las transacciones mediante DML directo y conserva el aislamiento con un propietario de funciones acotado. |
| Bloqueos y Auth interno | Sustituir el lock asesor y su helper por `SELECT … FOR UPDATE` sobre el perfil de la cuenta dentro de las transacciones de escritura. Inicializar primero de forma segura con `INSERT … ON CONFLICT`. Leer el instante de alta de Auth con un auxiliar de alcance mínimo al inicializar y conservarlo como metadato no editable. Probar visibilidad de escrituras concurrentes bajo `READ COMMITTED`. |
| Frases y ampliaciones | Aplazar cualquier esquema de frases, cambios de zona, restauración de tareas, pruebas de carga y endurecimiento para operación comercial. |

**Orden de migración.** Cotejar historial, permisos y conteos con el árbol local. Preparar solo la cadena mínima para un destino comprobado sin migraciones de la app. Si hay migraciones registradas o datos existentes, diseñar una migración correctiva hacia adelante y preservar histórico, identidades y fechas. Confirmar la reconciliación antes de tocar datos. Mantener las escrituras cerradas durante la transición y verificar con dos cuentas antes de habilitarlas. La ejecución del SQL requiere autorización separada. [Funciones y privilegios de Supabase](https://supabase.com/docs/guides/database/functions).

### Inspección de Supabase Cloud [PENDIENTE DE EVIDENCIA]

La configuración local apunta a un host HTTPS de Supabase Cloud y tiene clave publicable. Esta sesión carece de acceso de catálogo o Dashboard. La observación histórica de 07-00 solo indicaba que entonces la consulta del propietario no devolvió tablas visibles en `public`. La aplicación, los permisos y el volumen de datos actuales siguen sin verificar.

En Supabase Dashboard, abrir el proyecto académico y comparar en privado su **Reference ID** en **Project Settings → General** con el prefijo del host de `VITE_SUPABASE_URL`. Confirmar los esquemas expuestos en **Integrations → Data API → Settings**. Abrir **SQL Editor → New query** y ejecutar estas consultas de solo lectura. Compartir versiones, definiciones y conteos sin claves, identificadores de cuentas ni filas de usuario. [Guía de Data API de Supabase](https://supabase.com/docs/guides/api/quickstart).

```sql
select current_setting('server_version') as postgres,
       to_regclass('supabase_migrations.schema_migrations') as migration_history;

select c.relname as table_name, c.relrowsecurity as rls,
       pg_get_userbyid(c.relowner) as table_owner, r.role_name,
       has_table_privilege(r.role_name, c.oid, 'SELECT') as can_select,
       has_any_column_privilege(r.role_name, c.oid, 'INSERT, UPDATE')
         or has_table_privilege(r.role_name, c.oid, 'DELETE, TRUNCATE') as can_write
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
cross join (values ('anon'), ('authenticated')) r(role_name)
where n.nspname = 'public' and c.relkind in ('r', 'p')
order by c.relname, r.role_name;

select table_name, column_name, data_type, is_nullable
from information_schema.columns
where table_schema = 'public'
order by table_name, ordinal_position;

select c.relname as table_name, con.conname, pg_get_constraintdef(con.oid) as definition
from pg_constraint con
join pg_class c on c.oid = con.conrelid
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
order by table_name, con.conname;

select tablename, policyname, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'public'
order by tablename, policyname;

select n.nspname as schema_name, p.oid::regprocedure as routine,
       pg_get_userbyid(p.proowner) as owner_role, p.prosecdef as is_definer,
       has_schema_privilege(r.role_name, n.oid, 'USAGE') as schema_usage,
       has_function_privilege(r.role_name, p.oid, 'EXECUTE') as can_execute
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
cross join (values ('anon'), ('authenticated')) r(role_name)
where n.nspname = 'adhd_ladder_private'
   or (n.nspname = 'public' and p.proname in
       ('bootstrap_account', 'create_task', 'rename_task', 'archive_task',
        'set_task_completion', 'set_health_goal'))
order by schema_name, routine, r.role_name;
```

Si existe la tabla de historial, ejecutar `select version from supabase_migrations.schema_migrations order by version;`. Ejecutar solo las líneas de conteo cuyas tablas aparezcan en el inventario. La última devuelve solo una cifra de Auth.

```sql
select count(*) as profiles from public.profiles;
select count(*) as tasks, count(archived_at) as archived from public.tasks;
select count(*) as task_completions from public.task_completions;
select count(*) as health_checks from public.health_checks;
select count(*) as auth_accounts from auth.users;
```

Para permisos de columna o diferencias en el rol escritor, usar las consultas de catálogo del [procedimiento histórico de 07-01](../supabase/tests/07-01-task-integrity.md) sobre objetos existentes, sin ejecutar sus concesiones de prueba. Un historial ausente y conteos vacíos se interpretan junto al inventario de esquema. Cualquier fila existente requiere evaluar el impacto antes de autorizar la migración.

### Assets y calidad visual

Ilustraciones de producción en WebP, iconos/logo en SVG según conveniencia, decoración y fondos en CSS, textos y botones accesibles en HTML. Las fuentes preferidas son Patrick Hand y Kalam, con fallback de sistema. Mantener los mockups aprobados y el estilo orgánico sin introducir imágenes de texto innecesarias.

**Guía de vistas privadas:** márgenes laterales de Life, Activities y Learning alineados con Health. Preservar en tablet/móvil la ubicación de ilustraciones, evitando espacios verticales excesivos; el globo de edición del nombre debe centrarse en móvil sin perder la punta que apunta al lápiz. Estas observaciones son requisitos visuales; su cumplimiento final exige verificación real.

---

## 04 · Checklist de desarrollo y evaluación

### A · Condiciones críticas de entrega de TripleTen (Etapa 1)

Fuente oficial consultada: `docs/Etapa_1_aplicacion_front_end.pdf` (copia local, tres páginas). La rúbrica evalúa el frontend de Etapa 1. Express y la persistencia son decisiones del proyecto. Verificar las lecciones 1.1 y 1.2 cuando estén disponibles y confirmar el acceso del evaluador a la funcionalidad desde `/`.

- [ ] Entregar URL del PR `stage-frontend` → `main` antes del plazo.
- [ ] `npm install`, `npm run dev`, `npm run build` y `npm run lint` sin fallos.
- [ ] API third-party consumida realmente con `fetch()`, datos visibles y estados de carga/error.
- [ ] Aplicación desplegada y rutas internas recargables sin 404.
- [ ] Errores críticos de una revisión académica anterior corregidos, si aplica.
- [ ] README con nombre, propósito, stack, proveedor de API y URL pública.

### B · Calidad frontend

La rúbrica original incluye criterios de desempeño valorados en **4,21 puntos cada uno**, buenas prácticas de **1,5 puntos cada una** y recomendaciones de **1 punto cada una**; las categorías siguientes agrupan los requisitos para seguimiento, no sustituyen el documento oficial del curso.

- [ ] TypeScript consistente (incluidos iconos y componentes); componentes reutilizables y props tipadas; hooks fuera de condicionales/bucles; keys estables que no dependan del índice.
- [ ] Estructura de componentes, estilos, assets, utilidades, configuración y recursos externos clara; constantes organizadas en configuración; listeners limpiados al desmontar.
- [ ] Responsive desde 320 px, teclado/focus, semántica HTML, imágenes optimizadas con `alt`, fuentes conectadas con fallback de sistema, normalize/reset y contraste suficiente.
- [ ] Formularios con placeholder, required cuando corresponda, validación y foco; cuenta con estados carga/error y restauración de sesión; enlaces y botones semánticos.
- [ ] Ruta de funcionalidad y ruta sobre la autora con navegación completa, según el PDF. En este proyecto son Life accesible desde `/` con sesión y `/about` pública. El PDF nombra `react-router-dom`. La versión 8 instalada lo reemplaza por `react-router` y sus entradas DOM. Documentar la equivalencia y confirmar el criterio con el evaluador en 07-10. [Migración oficial de React Router](https://reactrouter.com/upgrading/v7#react-router-dom).
- [ ] Fetch con respuesta tipada, manejo de fallos y estado vacío; paginación/cargar más solo si el servicio lo requiere y tiene sentido.
- [ ] `.env` excluido del repo; `.env.example` sin credenciales; sin build ni `node_modules` versionados; sin archivos sobrantes de Vite.

### C · Buenas prácticas y recomendaciones de evaluación

- [ ] Estado inicial tipado, tipos compartidos y nombres legibles; estructura mantenible y sin código muerto.
- [ ] Respuestas vacías explícitas y, si una API devuelve listas largas, paginación o «cargar más» cuando corresponda.
- [ ] Estados hover y focus en controles; iconos SVG e imágenes optimizadas; fuentes alternativas y `alt` descriptivos.
- [ ] Historial Git con mensajes descriptivos cuando el propietario autorice commits.

### D · QA funcional obligatorio del producto

- [ ] Cuentas nuevas reciben las seis tareas de ejemplo una sola vez.
- [ ] Máximo cuatro tareas activas por Activities/Learning; menu Settings oculta Delete Card si solo queda una.
- [ ] Marcar una tarea hoy suma exactamente uno en su escalera; repetir no duplica; desmarcar resta solo hoy.
- [ ] SectionCard de Life refleja exactamente el conteo de cada escalera; Life hoy = Activities hoy + Learning hoy.
- [ ] Los tres contadores históricos excluyen `todayLocalDate`; marcar/desmarcar hoy no los cambia.
- [ ] Tras cambiar de lunes a martes, pasos de lunes figuran en histórico **una sola vez** y hoy empieza en cero.
- [ ] Cerrar la app y volver días después no duplica ni pierde pasos; un día con cero no aumenta totales.
- [ ] Verificar la normalización al confirmar y la desmarcación de hoy al renombrar según §02.6, con el histórico intacto.
- [ ] Verificar el retiro de tarjetas marcadas y desmarcadas según §02.6, con Today correcto, histórico intacto y protección de la última activa.
- [ ] Health mantiene tres checks por fecha; reinicio visual no fuerza rojo; tabla de semáforo B completa.
- [ ] Racha de días cerrados conforme a su regla; no confundir con pasos totales ni días desde alta.
- [ ] Pruebas adversariales RLS con dos usuarios y FK cruzada de completaciones; bloqueo de lecturas/mutaciones ajenas.
- [ ] API de frases real visible en Life, con carga, error, reintento y vacío; conservar UX de revelación diaria.
- [ ] Popups: borrador de nombre conservado al cerrar afuera/Escape; Cancel descarta; Submit cambia en React; controles de Health clicables en toda la tarjeta.
- [ ] Fallo de Supabase, recuperación de sesión, carga vacía, mutación optimista fallida y cambio de cuenta comprobados.
- [ ] Revisar móvil/tablet, especialmente ilustración de Life y alineación del popup del Header; sin regresiones.

### E · Validación de código y release

- [ ] `git diff --check`, `npm run format:check` si existe, build y lint; reportar pruebas realmente ejecutadas.
- [ ] Despliegue con rewrite SPA, URL Auth correcta, dos cuentas probadas y README final.
- [ ] PR final creado y enviado; revisar cambios antes de fusionar. No comprometer ramas ni subir commits sin aprobación del propietario.

---

## 05 · Brief, prioridades y plan

### Objetivo y Definition of Done

Publicar una aplicación operativa para administrar pequeñas metas en Health, Activities y Learning, registrar completaciones por fecha y consultar pasos de hoy e históricos coherentes en Life. Está completa cuando la autenticación y el aislamiento RLS funcionan, los datos reales persisten, los contadores respetan la regla de días cerrados, la API externa de frases aporta contenido real, la app es responsive y accesible, está desplegada y el PR llega antes del 30/11.

### Priorización

- **P0:** integridad de completaciones y fechas, Auth y RLS, CRUD mínimo, contadores correctos, API third-party, rutas, build/lint, deploy y PR.
- **P1:** semáforo Health regla B, racha, pulido responsive y accesibilidad, confirmaciones de cambios destructivos.
- **P2:** animaciones, estadísticas avanzadas y mejoras cosméticas que no bloquean el MVP.

La UI de popups implementada provisionalmente en 06A no es prueba de que exista CRUD persistente.

### Calendario

El [plan vigente](plan-de-trabajo.md) mantiene el camino crítico y el estado verificable. Meta de entrega el 28–29 de noviembre y plazo oficial el 30 de noviembre de 2026.

### Flujo de trabajo

El propietario aprueba las decisiones de producto y el alcance. El flujo operativo entre el propietario, ChatGPT y Codex, incluidas las autorizaciones y el commit personal del propietario, se rige por `AGENTS.md`.

---

## 06 · Validación, defensa y riesgos

### Defensa técnica

La defensa recorre una acción real de React a Express y PostgreSQL. La vista conserva el estado compartido, el controlador valida y orquesta la operación y la base asegura propiedad y atomicidad. La frase pública enseña un segundo flujo independiente mediante Fetch. Around ofrece los equivalentes de routing, controladores y middleware para explicar el cambio a Supabase Auth y RLS.

### Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Incluir pasos de hoy en históricos | Filtro estrictamente `completed_date < todayLocalDate`; pruebas lunes/martes |
| Duplicar totales al cambiar de día o abrir tras varios días | Derivar desde completaciones únicas fechadas; sin job nocturno ni acumulador redundante |
| Perder histórico al retirar una tarea | Archivar con `archived_at` y eliminar únicamente su completación de hoy según §02.6 |
| Confundir reinicio de checks de Health con rojo automático | Evaluar regla B con hoy y ayer |
| Inconsistencia entre vistas | Una fuente de completaciones por cuenta y funciones puras compartidas |
| RLS insuficiente | Pruebas de aislamiento con dos usuarios y referencias cruzadas |
| Acceso al catálogo o datos previos desconocidos | Inspección de solo lectura antes de elegir la cadena y reconciliación sin pérdida del histórico |
| Desfase de despliegue entre cliente, API y Auth | Probar en el origen HTTPS final la recarga SPA, el API JSON y las redirecciones de Supabase |
| API pública de frases fuera de servicio o CORS | Verificación temprana y proveedor alternativo aprobado |
| Limitaciones del plan gratuito Supabase o email de confirmación | Verificar configuración y disponibilidad antes de revisión |
| Desbordamiento móvil y popups | Verificar desde 320 px y teclado; no ocultar overflow como arreglo |
| Documentos del repo con reglas antiguas | Aplicar la precedencia de `AGENTS.md` y sincronizar referencias operativas en una tarea aprobada. Ver ARC-02 en el plan. |
| Tiempo insuficiente para requisitos obligatorios | Priorizar P0, congelar pulidos opcionales y desplegar con margen |

### Validación no certificada

El plan registra comprobaciones existentes de frontend y las pendientes sobre el resultado integrado. Quedan por comprobar el catálogo de Supabase Cloud, las operaciones persistidas, RLS efectivo con dos cuentas, los escenarios representativos de concurrencia y el despliegue listo para la revisión académica.

---

## 07 · Histórico de decisiones y vigencia

### 19–21 de noviembre de 2026 — Origen

- [DECIDIDO] Proyecto final TripleTen Etapa 1; React/TypeScript/Vite; diseño de escaleras en inglés; paleta verde `#005C3C`, crema `#FDF2E5` y naranja `#FF891C`.
- [CORRECCIÓN] Se descarta persistencia exclusivamente local y Open Library como eje del proyecto; Supabase gestiona cuentas y datos y una API pública separada debe entregar frases. Sin Express ni MongoDB.
- [DECIDIDO] Mockups y enfoque visual; fondos en CSS y arte de escalera optimizado.

### 22 de noviembre de 2026 — Dossier v2.1

- [DECIDIDO] Life suma Activities y Learning; Health no suma pasos.
- [DECIDIDO] Health regla B, racha de días cerrados, cuentas con tareas de ejemplo una sola vez, fecha calendario local.
- [PROP en su momento] `archived_at` como mecanismo de retiro. La regla aprobada en §02.6 sustituyó la alternativa de borrado definitivo.
- [CONTEXTO HISTÓRICO] El dossier original declaraba que el repositorio todavía no existía. Era cierto para aquella redacción, **no describe el estado del proyecto el 24/11**.

### 23–24 de noviembre de 2026 — Interfaz y 06A

- [DECIDIDO] Cuatro tareas activas como máximo por Activities/Learning; Delete Card no aparece si solo queda una.
- [DECIDIDO] Popups de edición con Cancel, Submit y cierre exterior preservando borrador; nombre temporal React. Health check desde toda la tarjeta; Life revela una frase aleatoria por fecha y la conserva en sesión.
- [REPORTADO, NO CERTIFICADO] Codex informó que implementó 06A y pasó sus verificaciones. Las frases eran locales y la sesión simulada: **no se conectó la API externa**.
- [PENDIENTE DE VERIFICACIÓN] Regresión de margen vertical de ilustración Life en tablet/móvil y globo de nombre descentrado en móvil, si todavía no se corrigieron localmente.

### 24 de noviembre de 2026 — Nueva regla de contadores v2.2 [DECIDIDO]

- **Sustituye expresamente** cualquier definición anterior de «total de cuenta», «lifetime total» o «total steps» que incluyera completaciones del día actual.
- [DECIDIDO] Hoy suma pasos de Activities y Learning marcados en la fecha local actual; desmarcar resta hoy; Life refleja la suma numérica.
- [DECIDIDO] `Your total steps` refleja **solo días anteriores**; al cambiar de día, el progreso anterior se incorpora lógicamente sin borrar ni mover registros, ni depender de una app abierta a medianoche.
- [DECIDIDO] El histórico no depende de tarjetas activas y no se reduce por renombrar o retirarlas.
- [DECIDIDO] Health no genera pasos y sus checks diarios empiezan vacíos; su color continúa sujeto a regla B.
- [DECIDIDO en 06B-05] El propietario aprobó `archived_at` y la eliminación exclusiva de la completación de hoy al retirar una tarjeta. Las reglas vigentes están en §02.6.

### 25 de noviembre de 2026 — Arquitectura académica v2.3 [DECIDIDO]

- La API propia Express y el contrato TypeScript-first de §03 sustituyen el acceso directo desde React a datos privados de Supabase como diseño final. Supabase Auth conserva el acceso desde React y PostgreSQL conserva RLS y las operaciones indivisibles.
- Se aprueba el inicio por sesión en `/`, con `/life` y el estado privado compartido vigentes. La persistencia de frases prevista en DEC-07-03 queda aplazada con 07-08.
- [HISTÓRICO] DEC-07-03 preveía conservar una sola asignación por cuenta y fecha, incluso ante concurrencia. La asignación se recuperaría tras recarga o cambio de dispositivo. El historial se conservaría y la prevención de duplicados consultaría hoy y los seis días anteriores. Su ejecución queda fuera de esta entrega.
- La cadena SQL histórica aporta una línea base de revisión. La adopción de sus componentes se decide con la propuesta de §03 y la evidencia de Cloud. DEC-07-01, DEC-07-02 y DEC-07-04 siguen vigentes hasta aprobar cambios de producto.

### Referencias

Rúbrica local de TripleTen Etapa 1, [Around en `main`](https://github.com/28Dara/web_project_around_full/tree/main), mockups 01–07, paleta, tokens y [AGENTS.md](../AGENTS.md). La vigencia de las decisiones de producto se indica en este dossier y el plan registra su implementación.

**Regla final para futuras implementaciones:** en caso de contradicción entre el relato histórico y las secciones normativas 02.2–02.6, prevalecen estas últimas y cualquier instrucción posterior explícita del propietario.
