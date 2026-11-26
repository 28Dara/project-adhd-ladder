# ADHD Ladder — Dossier integral v2.5

> **Documento normativo del producto · 25 de noviembre de 2026.** Consolida la arquitectura aprobada para el MVP académico, los requisitos académicos de las dos etapas y los ajustes de alcance. La lógica de contadores de v2.2 sigue vigente.
>
> **Precedencia de decisiones:** instrucción explícita más reciente del propietario > decisiones `[DECIDIDO]` de este dossier > plan de trabajo > propuestas `[PROP]`. Los puntos `[ABIERTO]` no autorizan implementaciones especulativas. El historial conserva su valor histórico, pero no sustituye las reglas vigentes.

**Producto:** ADHD Ladder · **Entrega:** proyecto final TripleTen, con Etapa 1 y Etapa 2 diferenciadas. **Stack:** React, TypeScript, Vite, React Router, Node.js, Express, MongoDB Atlas, Mongoose, bcrypt, jsonwebtoken y Fetch nativo para Express y DummyJSON.

**Fecha de corte:** 25/11/2026 · **Plazo oficial:** 30/11/2026 · **Objetivo de entrega:** PR `stage-frontend` → `main` el 28 o 29/11. Etapa 2 usa su propio PR `stage-fullstack` → `main`. Confirmar su plazo aplicable. El calendario vigente está en el plan de trabajo.

## Qué cambió en v2.4 [DECIDIDO]

- MongoDB Atlas y Mongoose sustituyen Supabase como destino de persistencia. Express conserva su fundación TypeScript y asume autenticación propia con bcrypt y jsonwebtoken. El objetivo es completar TripleTen dentro del plazo con tecnologías del bootcamp que la desarrolladora pueda mantener y explicar.
- Se conservan la estructura `client/` y `server/`, la entrada por `/` según sesión, el alias privado `/life` y los contratos de producto de §02.
- DummyJSON conserva su comportamiento en memoria de la sesión. 07-08 queda aplazado. El inventario y la preservación de posibles cuentas y datos anteriores se tratan en §03.

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
| Sign Up / Log In | Email/contraseña, navegación de retorno, autenticación mediante Express | Rutas públicas |
| Life (`/` con sesión o `/life`) | Hoy, total histórico, racha, días desde alta, secciones Health/Activities/Learning, frase del día | Privada. Life = Activities + Learning |
| Health (`/health`) | Semáforo textual y tres objetivos fijos | Privada; no suma pasos |
| Activities (`/activities`) | Tareas activas, pasos de hoy, total histórico, añadir y gestionar | Privada; máximo cuatro activas |
| Learning (`/learning`) | Mismas reglas de tareas y contadores que Activities | Privada; máximo cuatro activas |
| About (`/about`) | Misión del producto y presentación del autor | Pública |
| Popups | Edición de nombre, menú de tareas, diálogo de añadir, confirmaciones, tooltips | UI implementada. Alta persistente pendiente |

Las cuatro escaleras comparten criterios visuales, pero **no** necesariamente la misma maquetación interna. Las páginas públicas mantienen sus propios márgenes. Diseño responsive a partir de 320 px; consultar mockups y CSS existente para detalles.

### Alcance y prioridades

**[DECIDIDO] Propósito al 25 de noviembre de 2026.** MVP académico y pieza de portafolio para un grupo pequeño de usuarios de demostración. La aplicación debe cumplir la rúbrica, mostrar una implementación funcional y permitir que la desarrolladora mantenga y defienda sus decisiones en una entrevista. Express expone la API de la aplicación y gestiona la identidad. MongoDB Atlas persiste los datos. La operación remota requiere su autorización correspondiente.

| Capa de alcance | Qué comprende |
|---|---|
| Requisitos académicos | Etapa 1 exige frontend funcional y API externa mediante `fetch()`. Etapa 2 evalúa autenticación, API y persistencia propias. Ambas requieren su PR. Ver §04 y [07-AUD](07-AUD-cumplimiento-academico.md). |
| Producto esencial | Auth, aislamiento por cuenta en la API, tareas y completaciones por día, archivo con historial, progreso derivado, Health y los flujos aprobados que los sostienen. |
| Comportamiento adicional aprobado | Racha, antigüedad, tareas iniciales y frase de sesión según §§02.6–02.10. |
| Mejoras opcionales | Pulido cosmético y controles adicionales justificados por evidencia. El plan conserva los pendientes P2. |
| Fuera del MVP | Operación comercial, pruebas de carga, Docker, WSL, analítica clínica e historial de frases entre sesiones y dispositivos. |

Priorizar la conformidad académica y una versión demostrable con seguridad e integridad verificadas. Mantener las decisiones de producto del capítulo 02 hasta que el propietario autorice un cambio concreto.

---

## 02 · Especificación funcional y lógica

### 02.1 Rutas, sesión y seguridad

`/` muestra Landing sin sesión y Life con sesión, tras completar la restauración. `/about` es pública. `/signup` y `/login` son para visitantes y mantienen la redirección a `/life` para sesiones activas. `/life`, `/health`, `/activities` y `/learning` requieren sesión y, sin ella, redirigen a `/login`. El cierre exitoso vuelve a `/`. Life en `/` y `/life` usa el mismo layout privado y estado de cuenta que las demás escaleras.

React Router gobierna la navegación. Express verifica cada JWT y aplica la identidad verificada a todas las consultas privadas. El `AuthProvider` existente restaura la sesión mediante el endpoint de cuenta actual según §03.

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

**DEC-07-01 [DECIDIDO] · Fecha local.** Las operaciones fechadas conservan el día calendario local del dispositivo y preservan la sincronización de lectura y escritura corregida en AUD-02-01. Express las valida según DEC-07-04. La interfaz sigue sin configuración de zona horaria y la fecha UTC no sustituye el día local.

**DEC-07-02 [DECIDIDO] · Integridad temporal.** Rechazar registros fechados antes del alta. Usar la fecha real de registro de la cuenta según el contrato de fecha local y proteger los días cerrados. Al persistir un renombrado efectivo o un retiro, confirmar o revertir juntos el cambio de la tarjeta y la eliminación exclusiva de su completación de hoy, conforme a §02.6.

**DEC-07-04 [DECIDIDO] · Referencia fija de escritura.** La primera operación fechada exitosa fija para la cuenta la zona horaria detectada y declarada por el dispositivo. Durante el MVP se conserva esa referencia sin selector ni modificación posterior. La fecha capturada al realizar cada acción debe coincidir con el día que Express calcula con el reloj del servidor tanto en la zona declarada como en la referencia fija. La referencia también determina la fecha local de alta real y protege los días cerrados. Si los días no coinciden, la escritura se rechaza sin trasladarla automáticamente a otro día. Esto puede impedir temporalmente escribir desde dispositivos con días locales distintos. Express comprueba la coherencia de la fecha declarada a partir de los datos que recibe del navegador.

**Compatibilidad de zonas [DECIDIDO].** Admitir los identificadores de zona horaria que devuelven los navegadores, previa revisión técnica de su compatibilidad con Node.js e Intl. La implementación debe respetar las comprobaciones de DEC-07-04.

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

### 02.7 Health — progresión diaria [DECIDIDO en 07-10A]

Los tres objetivos diarios son **Good Nutrition, Good Sleep y Daily Movement**. Cada fecha empieza con las tres casillas desmarcadas. El nivel efectivo se comparte entre Health y el círculo de Life. Los objetivos aportan cero pasos.

| Nivel | Color | Descripción |
|---|---|---|
| 3 | Verde | You're doing great! |
| 2 | Amarillo | You got it, keep it up! |
| 1 | Naranja | Good start, but could be better |
| 0 | Rojo | Take a look at your health! |

Una cuenta nueva empieza en rojo. En un día sin interacciones, el nivel efectivo es el nivel final del día anterior menos uno, con mínimo de cero. Cada día adicional sin interacción resta un nivel hasta llegar a rojo. Con la primera interacción del día, el número de casillas actualmente marcadas pasa a determinar todo el nivel. Desmarcar las tres deja el día en rojo.

La ausencia de un registro diario representa un día sin interacción. Un registro con tres valores `false` representa un día con interacción y cero marcas. Conservar esa diferencia por fecha y cuenta. En Etapa 1, los registros residen en la sesión privada en memoria y se pierden al recargar, cerrar sesión o cambiar de cuenta.

La vista de Health resalta la descripción del nivel efectivo. Para verde o amarillo muestra «Your health is on track!». Para naranja o rojo muestra «Your streak is at risk!». En ambos casos incluye «Be honest with yourself.».

### 02.8 Racha [DECIDIDO en 07-10A]

Life calcula la racha con **días cerrados**, hasta ayer. La racha acumulada permanece durante el día abierto y se evalúa al cambiar de fecha.

- Health naranja o rojo al cierre reinicia la racha, aun si hubo pasos.
- Con Health verde o amarillo, un día con al menos un paso en Activities o Learning suma un día a la racha.
- Con Health verde o amarillo y cero pasos, la racha se mantiene sin sumar si el día anterior tuvo pasos. Dos días consecutivos sin pasos reinician la racha.

**Días en la escalera** cuenta los días calendario desde el registro, incluido el primero. Today y Total siguen las fórmulas de §02.3.

### 02.9 Modelo de datos [PROP]

| Colección | Campos clave propuestos | Restricciones y uso |
|---|---|---|
| `users` | `_id` ObjectId, `email`, `passwordHash`, `createdAt`, `writeTimeZone`, `tasksInitializedAt`, `taskWriteVersion` | Índice único de correo normalizado. El alta real se fija al registrar la cuenta. Zona y siembra empiezan sin inicializar. La versión coordina transacciones de tareas. El nombre editable del Header sigue en sesión. |
| `tasks` | `_id` UUID de texto, `ownerId`, `ladder`, `title`, `archivedAt`, `createdAt` | ID estable generado en el servidor para altas nuevas y preservado al importar. Índice por propietario, escalera y estado de archivo. El máximo de cuatro y el mínimo al archivar se verifican en la mutación coordinada. |
| `taskCompletions` | `ownerId`, `taskId`, `date` | Índice único compuesto `(ownerId, taskId, date)`. Express verifica que la tarea pertenece al mismo propietario y está activa antes de marcar. |
| `healthChecks` | `ownerId`, `date`, `nutrition`, `sleep`, `movement` | Índice único compuesto `(ownerId, date)`. Cada escritura modifica solo el objetivo solicitado y conserva el documento con las tres metas en `false` si hubo interacción. |
| Derivados | Today, Total, estado de Health, racha y días desde alta | Se calculan a partir de tareas, completaciones, Health, fecha de consulta y alta real. |

Usar esquemas Mongoose y validación de colección para los tipos y valores básicos del documento, e índices únicos efectivos antes de aceptar escrituras. La propiedad de las referencias entre documentos y las reglas de negocio se verifican en Express. Las fechas de acción se guardan como días calendario `YYYY-MM-DD`. Las fechas de alta, creación y archivo son instantes. Los modelos persisten registros por fecha para conservar el histórico sin acumularlo dentro de un documento.

### 02.10 Quotes API — requisito externo de Etapa 1

La API de frases de terceros se consume mediante `fetch()` en `client/src/utils/quotesApi.ts`, con respuesta verificada y tipada, transformación al tipo interno `Quote`, carga, error con reintento y estado vacío.

**Proveedor [DECIDIDO]** — DummyJSON, mediante `https://dummyjson.com/quotes/random`. Se consulta directamente desde el navegador, sin credenciales ni datos de cuenta. La respuesta debe contener `id` numérico, `quote` y `author` de texto. La aplicación conserva el texto original y lo muestra como texto plano. Se verifica CORS (intercambio de recursos entre orígenes) desde el navegador.

**Interacción aprobada** — Si la fecha local carece de frase asignada, Life muestra «Today's quote for you is...» y «Click to reveal». Solo se solicita una frase a DummyJSON al pulsar el botón. Al revelarla, desaparecen título y botón y se muestra solo la frase. Se conservan los estados de carga, error, vacío y reintento. Las respuestas de otro día o cuenta se descartan.

**Prevención de repeticiones [DECIDIDO]** — Comparar cada frase recibida con las revelaciones exitosas de la cuenta durante hoy y los seis días calendario locales anteriores. Se considera repetición si coincide el identificador o el texto al ignorar mayúsculas, minúsculas y espacios redundantes. Conservar el texto original al mostrarlo. Solicitar alternativas de forma secuencial y mantener la carga hasta obtener una frase válida y diferente o alcanzar cinco solicitudes totales por intento. Si las cinco se repiten, informar y permitir un reintento manual. Una frase revelada hace siete días o más vuelve a ser elegible.

**[DECIDIDO] Alcance del MVP.** La frase y la ventana de comparación se mantienen en memoria de la sesión privada. Recargar, cerrar sesión o cambiar de cuenta reinicia esa memoria. DEC-07-03 y 07-08 quedan aplazados para después de la entrega. DummyJSON y su gestión de errores siguen en el navegador.

### 02.11 Estado, persistencia y accesibilidad

- Mantener el estado compartido de las rutas privadas y los borradores en React. Tareas, completaciones y Health persisten en MongoDB a través de Express. Los hooks usan utilidades tipadas y los componentes se encargan de la presentación.
- Funciones puras para fechas, progreso, Health y racha. UI consistente en Life/Activities/Learning desde la misma fuente de completaciones por usuario y fecha.
- Aislamiento en todas las consultas privadas, verificado con dos cuentas. Controlar carreras de solicitudes, respuestas antiguas tras cambio de cuenta y reversión de actualizaciones optimistas fallidas.
- Accesibilidad: `button`, `a`, `label`, teclado, foco visible, estados de carga/error, indicadores de color acompañados de texto, popups cerrables y formularios con validación.
- Responsive a partir de 320 px sin desbordamiento horizontal; no ocultar overflow como remedio para fallos de maquetación.

---

## 03 · Tecnologías, arquitectura y diseño

### Stack y referencia [DECIDIDO]

- El cliente usa Vite, React, TypeScript y React Router, con CSS, Grid/Flex, normalize y tokens de color propios. Usa Fetch nativo para Express y, de forma independiente, para DummyJSON.
- El servidor usa Node.js y Express con TypeScript, Mongoose para MongoDB Atlas, bcrypt para contraseñas y jsonwebtoken para sesiones.
- La referencia principal es [Around, versión inspeccionada `5d7db78`](https://github.com/28Dara/web_project_around_full/tree/5d7db784f0443a4c9f72a6b24515f2b217c5fe67). Adaptar el arranque con `mongoose.connect` de `server/src/app.ts`, los esquemas de `models/user.ts` y `models/card.ts`, validación, bcrypt y firma JWT de `controllers/users.ts`, verificación Bearer de `middleware/auth.ts`, router y `routes/users.ts`, tratamiento central de `middleware/error-handler.ts` y `utils/errors.ts`, y Fetch de `client/src/utils/api.ts`.
- Conservar el prefijo `/api`, el proxy Vite, `/healthz` bajo la API y el tratamiento de errores de 07-EXP. Adaptar Around a respuestas de cuenta propia, validación explícita de entradas, filtrado de propietarios, verificación estricta de JWT y logs sin datos sensibles.

### Separación de responsabilidades [DECIDIDO]

| Capa | Responsabilidad |
|---|---|
| React | Presentación, formularios, navegación, sesión, borradores y estado privado compartido. Fetch tipado hacia Express. Las funciones puras existentes calculan fechas, progreso, Health y racha. |
| Express | Autenticación, autorización, validación, normalización de entradas y reglas de negocio. Deriva el propietario del JWT verificado y lo incluye en cada lectura y escritura privada, incluidas referencias de tareas, upserts y operaciones dentro de una transacción. |
| MongoDB | Persiste documentos, aplica restricciones de documento e índices y garantiza operaciones atómicas y transacciones. La conexión y las credenciales pertenecen al servidor. |
| DummyJSON | Provee la frase pública. El navegador realiza la solicitud independiente y conserva la interacción de §02.10. |

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
      models/
      routes/
        index.ts
      types/
      utils/
    package.json
    tsconfig.json
    .env.example
  docs/
  .agents/
  AGENTS.md
  package.json
  README.md
  .gitignore
```

El frontend vive en el workspace `client/` con su entrada HTML, assets, configuración y ejemplo de entorno. Conserva sus módulos internos bajo `client/src/`. El lockfile de npm permanece en la raíz.

La base de 07-EXP vive en el workspace `server/`. `src/app.ts` inicia Express y monta el router de `src/routes/index.ts` bajo `/api`. `src/middleware/error-handler.ts` y `src/utils/errors.ts` definen las respuestas de error JSON. En desarrollo, Vite reenvía `/api` al puerto configurado mediante `PORT`, con `3000` como valor predeterminado. Ambos procesos leen el puerto del entorno o de `server/.env`.

### Implementación y despliegue [PROP]

- **Conexión.** Reutilizar la carga de entorno de Node, los workspaces y los comandos de raíz. Validar `MONGODB_URI` y `PORT` en el servidor, y acotar el pool de Mongoose con `maxPoolSize`. La rúbrica exige salud HTTP independiente de Atlas. 07-01 evaluará iniciar HTTP con salud pública mientras se abre la conexión, devolver 503 en rutas dependientes cuando falte BD y emitir diagnósticos saneados. Configurar `JWT_SECRET` de alta entropía en el servidor al incorporar la firma. `server/.env.example` solo lleva ejemplos ficticios. En Atlas, usar un usuario de base de datos con permisos limitados a la base de la app y autorizar las IP de desarrollo y alojamiento necesarias. Preparar una base de pruebas separada. [Conexión a Atlas](https://www.mongodb.com/docs/atlas/connect-to-database-deployment/).
- **Credenciales y JWT.** Validar en el controlador los campos obligatorios, tipos, formato de correo y longitud mínima de contraseña antes de operaciones de BD. Completar validación con el esquema Mongoose. Normalizar el correo y usar el índice único incluso ante registros concurrentes. Guardar el hash bcrypt con factor de trabajo comprobado y rechazar contraseñas de más de 72 bytes UTF-8 para evitar truncamiento. Excluir el hash de consultas por defecto y de todas las respuestas. El login compara con bcrypt y devuelve un 401 genérico para correo desconocido o contraseña incorrecta. Limitar intentos en registro e inicio de sesión con respuesta 429. Firmar un JWT de duración corta con el identificador en `sub`; verificar firma, algoritmo permitido, expiración e identidad antes de usarlo. Rechazar filtros, operadores o campos de propietario suministrados por el cliente. Usar respuestas privadas sin caché, errores JSON y logs saneados. Una indisponibilidad de datos se distingue de una credencial inválida.
- **Sesión React.** Mantener `AuthProvider`, formularios, guardas y `PrivateLayout`. El alta confirma el registro y conserva el acceso a Log In del formulario actual. El login establece la sesión. El cliente tipado lee `VITE_API_URL` y adjunta el JWT vigente vía `Authorization: Bearer …` en cada petición privada. Restaurar con `GET /api/users/me`. E2-C17 exige `localStorage`; su adopción o la aceptación académica de `sessionStorage` queda abierta. E2-C19 nombra `CurrentUserContext.Provider`; adaptar el único contexto existente mediante el flujo de aprobación frontend. Expiración o 401 de la sesión vigente la invalida; los fallos transitorios conservan el reintento. Logout borra token y estado de cuenta. El token es accesible desde JavaScript y un token copiado sigue vigente hasta expirar. Usar HTTPS, renderizado seguro y vida corta. Mantener las respuestas tardías de una sesión anterior fuera de la vigente, incluido un 401 tardío. Adaptar `useRegistrationDate` al instante real de alta devuelto por Express y calcular el día de alta en la referencia fija cuando esté disponible. Actualizar esa referencia en el estado de cuenta tras la primera escritura fechada. Preservar borradores, funciones derivadas, rutas directas y nombre editable del Header. DummyJSON conserva el calendario del navegador y su solicitud independiente.
- **Publicación.** En local Vite reenvía `/api`. Para Etapa 2, documentar las URLs públicas de frontend y API, conectar Atlas y configurar CORS con `CLIENT_ORIGIN` y `trust proxy` según la plataforma. Un mismo origen HTTPS con frontend servido por Express y API bajo `/api` queda sujeto a aceptación académica. El fallback de la SPA se limita a navegación GET y excluye rutas de API y archivos inexistentes. Verificar puerto, interfaz de escucha y origen real en 07-11.

**[ABIERTO] Contratos evaluados de Etapa 2.** Ver decisiones de [07-AUD](07-AUD-cumplimiento-academico.md#decisiones-de-aceptación) para rutas literales de Auth, 403 en eliminación ajena y aceptación del DELETE archivado. Mantener los routers por recurso montados desde el índice, errores centralizados y `/api/healthz` público. Preservar el archivo y el histórico de §02.6.

| REST propuesto | Responsabilidad |
|---|---|
| `GET /api/healthz` | Respuesta pública del proceso, sin datos de cuenta. |
| `POST /api/signup` | Validar correo y contraseña, registrar y devolver datos de cuenta permitidos. |
| `POST /api/signin` | Verificar credenciales y devolver JWT y cuenta. |
| `GET /api/users/me` | Devolver la cuenta verificada y su fecha real de alta. |
| `POST /api/account/bootstrap` | Sembrar tareas una sola vez y devolver metadatos de cuenta. La zona se fija en la primera operación fechada exitosa. |
| `GET /api/tasks` | Leer tareas y completaciones propias, incluidas las archivadas para el histórico. |
| `POST /api/tasks` | Crear una tarea con escalera válida, título normalizado e ID estable. |
| `PATCH /api/tasks/:taskId` | Renombrar una tarea activa. Recibir título, fecha capturada y zona del dispositivo, y devolver la tarea y el resultado sobre su marca de hoy. |
| `DELETE /api/tasks/:taskId` | Archivar una tarea activa. Recibir fecha capturada y zona del dispositivo como parámetros y devolver la tarea y el resultado sobre su marca de hoy. |
| `PUT /api/tasks/:taskId/completions/:date` | Aplicar el estado deseado `completed: boolean` con la zona del dispositivo, de forma idempotente. |
| `GET /api/health` | Leer checks propios para Health y racha. |
| `PUT /api/health/:date/:goal` | Aplicar el estado deseado y la zona del dispositivo. Devuelve el registro confirmado, también si queda con las tres metas en `false` (§02.7). |

### Atomicidad y concurrencia [PROP]

- **Tareas.** Dentro de cada transacción de siembra, alta, renombrado, archivo o marca, actualizar primero la versión de escritura del usuario autenticado. Esa escritura común hace competir las operaciones de tareas de la misma cuenta y fuerza a reintentar conflictos con una nueva lectura. Sembrar las seis tareas y el indicador de siembra en una transacción. Exigir la inicialización antes de permitir altas y contar activas dentro de la transacción tras coordinar el acceso. Así el orden de llamadas del cliente preserva las seis tareas iniciales y el límite. Renombrado efectivo y archivo eliminan solo la marca de hoy en la misma transacción. Marcar y desmarcar validan propiedad y estado activo ahí mismo. El índice único respalda la idempotencia. Una marca concurrente con archivo respeta el orden confirmado y jamás queda una marca de hoy en una tarea archivada por esa carrera.
- **Fecha y Health.** Validar el día capturado con el reloj del servidor, la zona declarada y la referencia fija conforme a DEC-07-01/02/04. En las transacciones, evaluar tras obtener el acceso coordinado y volver a validar en cada reintento, con la fecha original. Si la zona aún no se fijó, confirmarla con la primera operación fechada exitosa en la misma transacción y coordinarla con las operaciones de tareas y Health mediante el mismo usuario. Con zona fija, Health usa una actualización atómica de un campo por cuenta y día. Revalidar la fecha antes de escribir y ante reintentos, por ejemplo si dos upserts intentan crear el mismo día. Una escritura explícita, incluso con `false`, crea el registro si falta con los otros objetivos desmarcados. Conservar la fila si las tres marcas quedan en `false`. Reservar la ausencia del documento para días sin interacción. [Atomicidad e índices únicos en MongoDB](https://www.mongodb.com/docs/manual/core/write-operations-atomicity/).
- **Lecturas.** `GET /api/tasks` obtiene las tareas y marcas de una misma vista coherente, con propietario en ambas lecturas. Las respuestas conservan los IDs y campos que necesita React. Usar respuestas confirmadas y conservar las fórmulas puras de progreso, semáforo y racha.

### Transición desde Supabase [PENDIENTE DE INVENTARIO AUTORIZADO]

- **Cliente.** 07-AUTH-UI retira `client/src/utils/supabaseClient.ts`, el SDK de `client/package.json` y sus entradas sin consumidores en `package-lock.json`, y la configuración `VITE_SUPABASE_*` de `client/.env.example` y `client/src/vite-env.d.ts`. Sustituye los tipos y llamadas del proveedor en `client/src/context/AuthContext.tsx`, `client/src/context/authContextValue.ts` y `client/src/app/AuthRoutes.tsx`; revisar también `useRegistrationDate` y el flujo de `AuthPage`. 07-AUTH-UI sustituye las instrucciones de arranque anteriores en `README.md`; 07-12 publica las instrucciones y URLs finales. Retirar variables reales del cliente y alojamiento en el corte autorizado.
- **SQL histórico.** Retirar del flujo activo las tres migraciones de `supabase/migrations/` (`20261123000000`, `20261123000100`, `20261124000000`) y la [guía de pruebas](../supabase/tests/07-01-task-integrity.md). Sus archivos y antecedentes se conservan como evidencia. El cambio de stack deja retiradas las propuestas SQL de v2.3.
- **Cuentas y datos.** 07-00 observó anteriormente cero tablas visibles en una consulta de `public`. El estado actual de Auth, esquema y datos sigue sin verificar. Antes de sustituir un servicio usado por cuentas existentes, 07-MIG debe inventariar con autorización y de solo lectura los usuarios de Auth, migraciones aplicadas, conteos por recurso y presencia de históricos. Compartir únicamente evidencia saneada. Si hay datos o usuarios, acordar y probar una transición separada con respaldo, reconciliación de propietarios, IDs de tarea, alta, zona, siembra, archivo, completaciones y Health, y corte reversible. Verificar control de la cuenta anterior mediante un procedimiento aprobado de reclamación o restablecimiento de credenciales. Durante el corte, evitar que el registro público reclame correos reservados a cuentas legadas. Una coincidencia de email por sí sola no demuestra propiedad. La portabilidad de hashes, credenciales federadas y cuentas sin confirmar requiere evaluación específica. Las sesiones anteriores deberán volver a autenticarse. El proyecto y los datos anteriores se conservan hasta que la propietaria apruebe su disposición.

### Assets y calidad visual

Ilustraciones de producción en WebP, iconos/logo en SVG según conveniencia, decoración y fondos en CSS, textos y botones accesibles en HTML. Las fuentes preferidas son Patrick Hand y Kalam, con fallback de sistema. Mantener los mockups aprobados y el estilo orgánico sin introducir imágenes de texto innecesarias.

**Guía de vistas privadas:** márgenes laterales de Life, Activities y Learning alineados con Health. Preservar en tablet/móvil la ubicación de ilustraciones, evitando espacios verticales excesivos; el globo de edición del nombre debe centrarse en móvil sin perder la punta que apunta al lápiz. Estas observaciones son requisitos visuales; su cumplimiento final exige verificación real.

---

## 04 · Checklist de desarrollo y evaluación

### A · Condiciones críticas de entrega de TripleTen (Etapa 1)

Fuente oficial y lección 1.2 cotejadas en [07-AUD](07-AUD-cumplimiento-academico.md). La rúbrica evalúa el frontend. Confirmar la modalidad de entrega, la lección 1.1 si está disponible y el acceso del evaluador a la funcionalidad desde `/`.

- [ ] Entregar URL del PR `stage-frontend` → `main` antes del plazo.
- [ ] `npm install`, `npm run dev`, `npm run build` y `npm run lint` sin fallos.
- [ ] API third-party consumida realmente con `fetch()`, datos visibles y estados de carga/error.
- [ ] Si Etapa 1 es la entrega final frontend, aplicación desplegada y rutas internas recargables sin 404. Si continúa a Etapa 2, confirmar cuándo corresponde publicar.
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

**Etapa 2.** Entregar la URL del PR `stage-fullstack → main` y demostrar Express, autenticación y persistencia en el entorno publicado, con frontend, API y Atlas accesibles según la rúbrica. [07-AUD](07-AUD-cumplimiento-academico.md#etapa-2--motivos-de-rechazo) registra los requisitos y su evidencia por ID.

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
- [ ] Health empieza con casillas vacías, aplica el descenso antes de la primera interacción y distingue un día sin registro de uno explícitamente desmarcado. Life y Health muestran el mismo nivel.
- [ ] Racha de días cerrados: Health naranja o rojo reinicia aun con pasos. Probar continuidad en verde o amarillo, la pausa de un día sin pasos y el día abierto.
- [ ] Pruebas de aislamiento con dos usuarios: lecturas y mutaciones ajenas rechazadas, incluidas completaciones con ID de tarea ajena. Verificar JWT ausente, inválido y expirado, y ausencia de credenciales en respuestas y logs.
- [ ] API de frases real visible en Life, con carga, error, reintento y vacío; conservar UX de revelación diaria.
- [ ] Popups: borrador de nombre conservado al cerrar afuera/Escape; Cancel descarta; Submit cambia en React; controles de Health clicables en toda la tarjeta.
- [ ] Fallo de Express o Atlas, recuperación de sesión, carga vacía, mutación optimista fallida y cambio de cuenta comprobados.
- [ ] Revisar móvil/tablet, especialmente ilustración de Life y alineación del popup del Header; sin regresiones.

### E · Validación de código y release

- [ ] `git diff --check`, `npm run format:check` si existe, build y lint; reportar pruebas realmente ejecutadas.
- [ ] Despliegue con rewrite SPA, restauración de sesión en HTTPS, dos cuentas probadas y README final.
- [ ] URL del PR de cada etapa entregada cuando corresponda. Revisar cambios y solicitar autorización antes de publicar o fusionar.

---

## 05 · Brief, prioridades y plan

### Objetivo y Definition of Done

Publicar una aplicación operativa para administrar pequeñas metas en Health, Activities y Learning, registrar completaciones por fecha y consultar pasos de hoy e históricos coherentes en Life. Está completa cuando la autenticación y el aislamiento de cuentas mediante Express funcionan, los datos reales persisten, los contadores respetan la regla de días cerrados, la API externa de frases aporta contenido real, la app es responsive y accesible y se verifican el despliegue y la entrega de Etapa 2. El cierre de Etapa 1 tiene su propio PR y las condiciones de §04.A.

### Priorización

- **P0:** integridad de completaciones y fechas, Auth y aislamiento, CRUD mínimo, contadores correctos, API third-party, rutas, build/lint, deploy y PR.
- **P1:** progresión diaria de Health, racha, pulido responsive y accesibilidad, confirmaciones de cambios destructivos.
- **P2:** animaciones, estadísticas avanzadas y mejoras cosméticas que no bloquean el MVP.

La UI de popups implementada provisionalmente en 06A no es prueba de que exista CRUD persistente.

### Calendario

El [plan vigente](plan-de-trabajo.md) mantiene el camino crítico y el estado verificable. Meta del PR de Etapa 1 el 28–29 de noviembre, con el 30/11/2026 como fecha indicada de cierre del programa. Confirmar el plazo aplicable a Etapa 2 y los tiempos de revisión.

### Flujo de trabajo

El propietario aprueba las decisiones de producto y el alcance. El flujo operativo entre el propietario, ChatGPT y Codex, incluidas las autorizaciones y el commit personal del propietario, se rige por `AGENTS.md`.

---

## 06 · Validación, defensa y riesgos

### Defensa técnica

La defensa recorre una acción real de React a Express y MongoDB Atlas. La vista conserva el estado compartido, Express verifica el JWT, aplica propiedad y ejecuta reglas, y MongoDB asegura unicidad y atomicidad. Around permite explicar los patrones de conexión, modelos, controladores y autenticación. La frase pública demuestra el segundo flujo independiente mediante Fetch.

### Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Incluir pasos de hoy en históricos | Filtro estrictamente `completed_date < todayLocalDate`; pruebas lunes/martes |
| Duplicar totales al cambiar de día o abrir tras varios días | Derivar desde completaciones únicas fechadas; sin job nocturno ni acumulador redundante |
| Perder histórico al retirar una tarea | Archivar con `archived_at` y eliminar únicamente su completación de hoy según §02.6 |
| Confundir día sin interacción con un día que acabó desmarcado | Conservar el registro de ceros y comprobar el descenso sin interacción |
| Inconsistencia entre vistas | Una fuente de completaciones por cuenta y funciones puras compartidas |
| Consulta sin filtro de propietario | Revisar todos los accesos privados y verificar dos cuentas con referencias cruzadas |
| Cuentas o datos anteriores sin inventario | Inventario autorizado y decisión de preservación antes del corte |
| Desfase de despliegue entre cliente, API y Auth | Probar en el origen HTTPS final la recarga SPA, la API JSON y la restauración de sesión |
| API pública de frases fuera de servicio o CORS | Verificación temprana y proveedor alternativo aprobado |
| Conexión o transacciones de Atlas indisponibles | Verificar nivel de acceso, red y capacidades del entorno de prueba en 07-01 |
| Desbordamiento móvil y popups | Verificar desde 320 px y teclado; no ocultar overflow como arreglo |
| Documentos del repo con reglas antiguas | Aplicar la precedencia de `AGENTS.md` y sincronizar referencias operativas en una tarea aprobada. Ver ARC-02 en el plan. |
| Tiempo insuficiente para requisitos obligatorios | Priorizar P0, congelar pulidos opcionales y desplegar con margen |

### Validación no certificada

El plan registra comprobaciones existentes de frontend y las pendientes sobre el resultado integrado. Quedan por comprobar el inventario legado, la conexión y los índices de Atlas, las operaciones persistidas, el aislamiento con dos cuentas, la concurrencia representativa y el despliegue para la revisión académica.

---

## 07 · Histórico de decisiones y vigencia

### 19–21 de noviembre de 2026 — Origen

- [DECIDIDO] Proyecto final TripleTen Etapa 1; React/TypeScript/Vite; diseño de escaleras en inglés; paleta verde `#005C3C`, crema `#FDF2E5` y naranja `#FF891C`.
- [CORRECCIÓN] Se descarta persistencia exclusivamente local y Open Library como eje del proyecto; Supabase gestiona cuentas y datos y una API pública separada debe entregar frases. Sin Express ni MongoDB.
- [DECIDIDO] Mockups y enfoque visual; fondos en CSS y arte de escalera optimizado.

### 22 de noviembre de 2026 — Dossier v2.1

- [DECIDIDO] Life suma Activities y Learning; Health no suma pasos.
- [HISTÓRICO] Health usaba la regla B, sustituida por 07-10A. Se aprobaron la racha de días cerrados, la siembra única y la fecha calendario local.
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
- [DECIDIDO] Health aporta cero pasos y sus checks diarios empiezan vacíos. El nivel vigente se define en §02.7.
- [DECIDIDO en 06B-05] El propietario aprobó `archived_at` y la eliminación exclusiva de la completación de hoy al retirar una tarjeta. Las reglas vigentes están en §02.6.

### 25 de noviembre de 2026 — Arquitectura académica v2.3 [HISTÓRICO]

- La API propia Express y el contrato TypeScript-first de §03 sustituyen el acceso directo desde React a datos privados de Supabase como diseño final. Supabase Auth conserva el acceso desde React y PostgreSQL conserva RLS y las operaciones indivisibles.
- Se aprueba el inicio por sesión en `/`, con `/life` y el estado privado compartido vigentes. La persistencia de frases prevista en DEC-07-03 queda aplazada con 07-08.
- [HISTÓRICO] DEC-07-03 preveía conservar una sola asignación por cuenta y fecha, incluso ante concurrencia. La asignación se recuperaría tras recarga o cambio de dispositivo. El historial se conservaría y la prevención de duplicados consultaría hoy y los seis días anteriores. Su ejecución queda fuera de esta entrega.
- La cadena SQL histórica aporta una línea base de revisión. La aplicación de esa cadena quedó pendiente. DEC-07-01, DEC-07-02 y DEC-07-04 conservan sus reglas de producto en v2.4.

### 25 de noviembre de 2026 — MongoDB y autenticación propia v2.4 [DECIDIDO]

- La propietaria aprueba Atlas, Mongoose, bcrypt y jsonwebtoken como arquitectura de entrega. 07-ARQ, 07-ROOT, 07-REL y 07-EXP permanecen registrados como hitos locales. Los contratos y artefactos de Supabase quedan como antecedentes de transición.

### Referencias

Rúbrica local de TripleTen Etapa 1, [Around en `main`](https://github.com/28Dara/web_project_around_full/tree/main), mockups 01–07, paleta, tokens y [AGENTS.md](../AGENTS.md). La vigencia de las decisiones de producto se indica en este dossier y el plan registra su implementación.

**Regla final para futuras implementaciones.** Aplicar las secciones normativas de producto y arquitectura y la precedencia indicada al inicio del dossier.
