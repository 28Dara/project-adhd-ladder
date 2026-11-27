# ADHD Ladder — Dossier integral v2.6

> **Documento normativo del producto · 25 de noviembre de 2026.** Consolida la arquitectura actual de Etapa 1, los requisitos académicos de las dos etapas y los ajustes de alcance. La lógica de contadores de v2.2 sigue vigente.
>
> **Precedencia de decisiones:** instrucción explícita más reciente del propietario > decisiones `[DECIDIDO]` de este dossier > plan de trabajo > propuestas `[PROP]`. Los puntos `[ABIERTO]` no autorizan implementaciones especulativas. El historial conserva su valor histórico, pero no sustituye las reglas vigentes.

**Producto:** ADHD Ladder · **Entrega:** proyecto final TripleTen, con Etapa 1 y Etapa 2 diferenciadas. **Stack:** React, TypeScript, Vite, React Router, Node.js, Express, Supabase Auth, npm Workspaces y Fetch nativo para DummyJSON.

**Fecha de corte:** 25/11/2026 · **Plazo oficial:** 30/11/2026 · **Objetivo de entrega:** PR `stage-frontend` → `main` el 28 o 29/11. Etapa 2 usa su propio PR `stage-fullstack` → `main`. Confirmar su plazo aplicable. El calendario vigente está en el plan de trabajo.

## Vigencia de arquitectura [DECIDIDO en 07-PRES]

La implementación vigente corresponde a Etapa 1. La persistencia y la autenticación definitivas de Etapa 2 quedan abiertas hasta la aclaración académica de la tutoría de TripleTen del 26 de noviembre de 2026 y una nueva decisión de la propietaria. Se preservan Supabase Auth, la fundación Express y los contratos de producto de §02. El historial de frases de 07-08 sigue aplazado.

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
| Sign Up / Log In | Email/contraseña, navegación de retorno, autenticación mediante Supabase Auth | Rutas públicas |
| Life (`/` con sesión o `/life`) | Hoy, total histórico, racha, días desde alta, secciones Health/Activities/Learning, frase del día | Privada. Life = Activities + Learning |
| Health (`/health`) | Semáforo textual y tres objetivos fijos | Privada; no suma pasos |
| Activities (`/activities`) | Tareas activas, pasos de hoy, total histórico, añadir y gestionar | Privada; máximo cuatro activas |
| Learning (`/learning`) | Mismas reglas de tareas y contadores que Activities | Privada; máximo cuatro activas |
| About (`/about`) | Misión del producto y presentación del autor | Pública |
| Popups | Edición de nombre, menú de tareas, diálogo de añadir, confirmaciones, tooltips | UI implementada. Alta persistente pendiente |

Las cuatro escaleras comparten criterios visuales, pero **no** necesariamente la misma maquetación interna. Las páginas públicas mantienen sus propios márgenes. Diseño responsive a partir de 320 px; consultar mockups y CSS existente para detalles.

### Alcance y prioridades

**[DECIDIDO] Propósito al 25 de noviembre de 2026.** MVP académico y pieza de portafolio para un grupo pequeño de usuarios de demostración. La aplicación debe cumplir la rúbrica, mostrar una implementación funcional y permitir que la desarrolladora mantenga y defienda sus decisiones en una entrevista. Express aporta la base de la API y la identidad la gestiona Supabase Auth. Tareas, completaciones y Health permanecen en memoria en Etapa 1. La operación remota requiere su autorización correspondiente.

| Capa de alcance | Qué comprende |
|---|---|
| Requisitos académicos | Etapa 1 exige frontend funcional y API externa mediante `fetch()`. Etapa 2 evalúa autenticación, API y persistencia propias. Ambas requieren su PR. Ver §04 y [07-AUD](07-AUD-cumplimiento-academico.md). |
| Producto esencial | Auth, aislamiento del estado por cuenta, tareas y completaciones por día, archivo con historial, progreso derivado, Health y los flujos aprobados que los sostienen. |
| Comportamiento adicional aprobado | Racha, antigüedad, tareas iniciales y frase de sesión según §§02.6–02.10. |
| Mejoras opcionales | Pulido cosmético y controles adicionales justificados por evidencia. El plan conserva los pendientes P2. |
| Fuera del MVP | Operación comercial, pruebas de carga, Docker, WSL, analítica clínica e historial de frases entre sesiones y dispositivos. |

Priorizar la conformidad académica y una versión demostrable con seguridad e integridad verificadas. Mantener las decisiones de producto del capítulo 02 hasta que el propietario autorice un cambio concreto.

---

## 02 · Especificación funcional y lógica

### 02.1 Rutas, sesión y seguridad

`/` muestra Landing sin sesión y Life con sesión, tras completar la restauración. `/about` es pública. `/signup` y `/login` son para visitantes y mantienen la redirección a `/life` para sesiones activas. `/life`, `/health`, `/activities` y `/learning` requieren sesión y, sin ella, redirigen a `/login`. El cierre exitoso vuelve a `/`. Life en `/` y `/life` usa el mismo layout privado y estado de cuenta que las demás escaleras.

React Router gobierna la navegación. El `AuthProvider` registra, autentica y restaura sesiones con Supabase Auth. El área privada se monta por ID de cuenta y mantiene su estado durante la sesión.

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

**DEC-07-01 [DECIDIDO] · Fecha local.** Las operaciones fechadas conservan el día calendario local del dispositivo y preservan la sincronización de lectura y escritura corregida en AUD-02-01. Para la futura persistencia, validar según DEC-07-04. La interfaz sigue sin configuración de zona horaria y la fecha UTC no sustituye el día local.

**DEC-07-02 [DECIDIDO] · Integridad temporal.** Rechazar registros fechados antes del alta. Usar la fecha real de registro de la cuenta según el contrato de fecha local y proteger los días cerrados. Al persistir un renombrado efectivo o un retiro, confirmar o revertir juntos el cambio de la tarjeta y la eliminación exclusiva de su completación de hoy, conforme a §02.6.

**DEC-07-04 [DECIDIDO] · Referencia fija de escritura.** La primera operación fechada exitosa fija para la cuenta la zona horaria detectada y declarada por el dispositivo. Durante el MVP se conserva esa referencia sin selector ni modificación posterior. La fecha capturada al realizar cada acción debe coincidir con el día calculado con el reloj del servidor tanto en la zona declarada como en la referencia fija. La referencia también determina la fecha local de alta real y protege los días cerrados. Si los días no coinciden, la escritura se rechaza sin trasladarla automáticamente a otro día. Esto puede impedir temporalmente escribir desde dispositivos con días locales distintos. La futura capa de escritura comprueba la coherencia de la fecha declarada a partir de los datos del navegador.

**Compatibilidad de zonas [DECIDIDO].** Admitir los identificadores de zona horaria que devuelven los navegadores, previa revisión técnica de su compatibilidad con el entorno de validación que se apruebe. La implementación debe respetar las comprobaciones de DEC-07-04.

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

### 02.9 Contratos de datos para la futura persistencia

| Datos | Contrato |
|---|---|
| Cuenta | Identidad estable y fecha real de alta. Aislamiento por propietario. Siembra única y referencia fija de escritura según DEC-07-04. |
| Tareas | ID estable, escalera, título y estado de archivo. Mantener el histórico de tareas retiradas y el límite de activas de §02.6. |
| Completaciones | Una por tarea y fecha. Aplicar las reglas de propiedad y la atomicidad de renombre y archivo de §02.6. |
| Health | Un registro por cuenta y fecha tras la primera interacción. Mantener independencia entre objetivos y conservar el registro con tres valores `false`. |
| Derivados | Today, Total, Health, racha y días desde alta se calculan a partir de los registros fuente. |

Las fechas de acción son días calendario `YYYY-MM-DD`. Las fechas de alta, creación y archivo son instantes. El modelo físico queda pendiente de la decisión de Etapa 2.

### 02.10 Quotes API — requisito externo de Etapa 1

La API de frases de terceros se consume mediante `fetch()` en `client/src/utils/quotesApi.ts`, con respuesta verificada y tipada, transformación al tipo interno `Quote`, carga, error con reintento y estado vacío.

**Proveedor [DECIDIDO]** — DummyJSON, mediante `https://dummyjson.com/quotes/random`. Se consulta directamente desde el navegador, sin credenciales ni datos de cuenta. La respuesta debe contener `id` numérico, `quote` y `author` de texto. La aplicación conserva el texto original y lo muestra como texto plano. Se verifica CORS (intercambio de recursos entre orígenes) desde el navegador.

**Interacción aprobada** — Si la fecha local carece de frase asignada, Life muestra «Today's quote for you is...» y «Click to reveal». Solo se solicita una frase a DummyJSON al pulsar el botón. Al revelarla, desaparecen título y botón y se muestra solo la frase. Se conservan los estados de carga, error, vacío y reintento. Las respuestas de otro día o cuenta se descartan.

**Prevención de repeticiones [DECIDIDO]** — Comparar cada frase recibida con las revelaciones exitosas de la cuenta durante hoy y los seis días calendario locales anteriores. Se considera repetición si coincide el identificador o el texto al ignorar mayúsculas, minúsculas y espacios redundantes. Conservar el texto original al mostrarlo. Solicitar alternativas de forma secuencial y mantener la carga hasta obtener una frase válida y diferente o alcanzar cinco solicitudes totales por intento. Si las cinco se repiten, informar y permitir un reintento manual. Una frase revelada hace siete días o más vuelve a ser elegible.

**[DECIDIDO] Alcance del MVP.** La frase y la ventana de comparación se mantienen en memoria de la sesión privada. Recargar, cerrar sesión o cambiar de cuenta reinicia esa memoria. DEC-07-03 y 07-08 quedan aplazados para después de la entrega. DummyJSON y su gestión de errores siguen en el navegador.

### 02.11 Estado, persistencia y accesibilidad

- Mantener el estado compartido de las rutas privadas y los borradores en React. Tareas, completaciones y Health viven en memoria durante la sesión privada en Etapa 1. Los hooks usan utilidades tipadas y los componentes se encargan de la presentación.
- Funciones puras para fechas, progreso, Health y racha. UI consistente en Life/Activities/Learning desde la misma fuente de completaciones por usuario y fecha.
- Aislamiento en todas las consultas privadas, verificado con dos cuentas. Controlar carreras de solicitudes, respuestas antiguas tras cambio de cuenta y reversión de actualizaciones optimistas fallidas.
- Accesibilidad: `button`, `a`, `label`, teclado, foco visible, estados de carga/error, indicadores de color acompañados de texto, popups cerrables y formularios con validación.
- Responsive a partir de 320 px sin desbordamiento horizontal; no ocultar overflow como remedio para fallos de maquetación.

---

## 03 · Tecnologías, arquitectura y diseño

### Stack y responsabilidades vigentes [DECIDIDO]

| Capa | Responsabilidad actual |
|---|---|
| Cliente React, TypeScript, Vite y React Router | Presentación, formularios, guardas y estado en memoria por cuenta. Funciones puras de fechas, progreso, Health y racha. |
| Supabase Auth | Registro, inicio y cierre de sesión y restauración en el cliente mediante `@supabase/supabase-js`. |
| Express y TypeScript | Fundación de API con `GET /api/healthz`, respuestas JSON, manejo centralizado de errores y proxy Vite en desarrollo. |
| DummyJSON | Frase externa solicitada directamente por el navegador con Fetch, según §02.10. |

[La referencia Around `5d7db78`](https://github.com/28Dara/web_project_around_full/tree/5d7db784f0443a4c9f72a6b24515f2b217c5fe67) aporta contexto histórico para la organización de cliente y servidor.

### Organización vigente [DECIDIDO]

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
      middleware/
      routes/
        index.ts
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

### Etapa 2 · decisión abierta y conservación de datos

Las alternativas de evaluación son continuar con Supabase PostgreSQL y Supabase Auth o usar MongoDB Atlas, Mongoose y autenticación propia con bcrypt y JWT. La [rúbrica de Etapa 2](Etapa_2_checklist.md) mantiene sus requisitos literales. Confirmar en la tutoría del 26 de noviembre de 2026 si la primera alternativa sería admisible. La decisión técnica y el inicio de la implementación requieren autorización posterior de la propietaria.

La propuesta previa de MongoDB queda como antecedente en `92643be` y en el plan anterior a 07-PRES (`a04c426`). Se conservan las migraciones SQL y la [guía histórica de pruebas](../supabase/tests/07-01-task-integrity.md). Cualquier corte futuro requiere inventario autorizado, preservación de cuentas e históricos y verificación de su correspondencia. La observación de 07-00 sobre las tablas visibles en `public` describe una consulta anterior. La correspondencia de email por sí sola no demuestra control de una cuenta.

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

**Etapa 2.** La rúbrica exige el PR `stage-fullstack → main` y enumera los requisitos de API, autenticación, persistencia y despliegue para el stack literal. Su aplicabilidad a las alternativas de §03 se aclarará en la tutoría. [07-AUD](07-AUD-cumplimiento-academico.md#etapa-2--motivos-de-rechazo) registra los requisitos y su evidencia por ID.

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
- [ ] Pruebas de aislamiento con dos usuarios: lecturas y mutaciones ajenas rechazadas, incluidas completaciones con ID de tarea ajena. Para la arquitectura que se apruebe, verificar el rechazo de sesiones ausentes, inválidas o expiradas y la ausencia de credenciales en respuestas y logs.
- [ ] API de frases real visible en Life, con carga, error, reintento y vacío; conservar UX de revelación diaria.
- [ ] Popups: borrador de nombre conservado al cerrar afuera/Escape; Cancel descarta; Submit cambia en React; controles de Health clicables en toda la tarjeta.
- [ ] Recuperación de sesión y cambio de cuenta comprobados. Para la arquitectura de Etapa 2 que se apruebe, comprobar fallos de servicios, carga vacía y mutación optimista fallida.
- [ ] Revisar móvil/tablet, especialmente ilustración de Life y alineación del popup del Header; sin regresiones.

### E · Validación de código y release

- [ ] `git diff --check`, `npm run format:check` si existe, build y lint; reportar pruebas realmente ejecutadas.
- [ ] Despliegue con rewrite SPA, restauración de sesión en HTTPS, dos cuentas probadas y README final.
- [ ] URL del PR de cada etapa entregada cuando corresponda. Revisar cambios y solicitar autorización antes de publicar o fusionar.

---

## 05 · Brief, prioridades y plan

### Objetivo y Definition of Done

Publicar una aplicación operativa para administrar pequeñas metas en Health, Activities y Learning, registrar completaciones por fecha y consultar pasos de hoy e históricos coherentes en Life. Está completa cuando la autenticación y el aislamiento de cuentas funcionan según la arquitectura que se apruebe, los datos reales persisten, los contadores respetan la regla de días cerrados, la API externa de frases aporta contenido real, la app es responsive y accesible y se verifican el despliegue y la entrega de Etapa 2. El cierre de Etapa 1 tiene su propio PR y las condiciones de §04.A.

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

La presentación de Etapa 1 demuestra la sesión con Supabase Auth, las rutas privadas, el estado compartido de las escaleras y una frase real vía Fetch. El endpoint `/api/healthz` permite mostrar la fundación Express por separado. La tutoría aclarará el alcance de persistencia y autenticación para Etapa 2.

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
| Elección de persistencia o autenticación incompatible con la rúbrica | Confirmar los requisitos en la tutoría y aprobar el diseño antes de implementarlo |
| Desbordamiento móvil y popups | Verificar desde 320 px y teclado; no ocultar overflow como arreglo |
| Documentos del repo con reglas antiguas | Aplicar la precedencia de `AGENTS.md` y sincronizar referencias operativas en una tarea aprobada. Ver ARC-02 en el plan. |
| Tiempo insuficiente para requisitos obligatorios | Priorizar P0, congelar pulidos opcionales y desplegar con margen |

### Validación no certificada

El plan registra comprobaciones existentes de frontend y las pendientes sobre el resultado integrado. Para Etapa 1 quedan las comprobaciones manuales y académicas de 07-10. Las verificaciones de persistencia, aislamiento y concurrencia corresponden al diseño que se apruebe para Etapa 2.

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

### 25 de noviembre de 2026 — MongoDB y autenticación propia v2.4 [HISTÓRICO]

- En `92643be` se registra la adopción inicial de Atlas, Mongoose, bcrypt y jsonwebtoken. 07-PRES suspende esa decisión hasta la aclaración académica. 07-ARQ, 07-ROOT, 07-REL y 07-EXP permanecen registrados como hitos locales. Los artefactos SQL se conservan como antecedentes. Supabase Auth sigue en uso en Etapa 1.

### 25 de noviembre de 2026 — 07-PRES [DECIDIDO]

Se prioriza la presentación de Etapa 1. Supabase Auth sigue operativo y Express conserva su fundación. La selección de persistencia y autenticación de Etapa 2 queda abierta hasta la tutoría del 26/11/2026 y la posterior decisión de la propietaria.

### Referencias

Rúbrica local de TripleTen Etapa 1, [Around en `main`](https://github.com/28Dara/web_project_around_full/tree/main), mockups 01–07, paleta, tokens y [AGENTS.md](../AGENTS.md). La vigencia de las decisiones de producto se indica en este dossier y el plan registra su implementación.

**Regla final para futuras implementaciones.** Aplicar las secciones normativas de producto y arquitectura y la precedencia indicada al inicio del dossier.
