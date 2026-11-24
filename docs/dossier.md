# ADHD Ladder — Dossier integral v2.2

> **Documento normativo del producto · 24 de noviembre de 2026.** Revisión integral de la v2.1 (22/11/2026). Conserva el propósito, el stack, el alcance de TripleTen y las decisiones vigentes. **La lógica de contadores de esta versión reemplaza cualquier formulación incompatible de v2.0/v2.1.**
>
> **Precedencia de decisiones:** instrucción explícita más reciente del propietario > decisiones `[DECIDIDO]` de este dossier > plan de trabajo > propuestas `[PROP]`. Los puntos `[ABIERTO]` no autorizan implementaciones especulativas. El historial conserva su valor histórico, pero no sustituye las reglas vigentes.

**Producto:** ADHD Ladder · **Entrega:** proyecto final TripleTen, Etapa 1 (frontend con API third-party). **Stack:** React, TypeScript, Vite, React Router, Supabase Auth y PostgreSQL con RLS; API pública de frases independiente, consumida con `fetch()`. Sin servidor Express/Node propio ni MongoDB.

**Fecha de corte:** 24/11/2026 · **Plazo oficial:** 30/11/2026 · **Objetivo de entrega:** PR `stage-frontend` → `main` el 28 o 29/11. El calendario original es orientativo: verificar progreso real antes de asignar nuevas tareas.

## Qué cambió en v2.2 [DECIDIDO]

- **Contadores diarios:** solo completaciones del día calendario local actual. Una casilla marcada aporta +1; desmarcarla revierte −1. Activities y Learning son independientes. Life es la **suma de sus valores numéricos**, nunca un contador de tarjetas de Life.
- **Totales históricos:** `Your total steps` incluye **solo pasos de fechas anteriores a hoy**; los pasos actuales no forman parte del total hasta cambiar el día calendario. Totales propios de Activities y Learning; Life total = suma de ambos históricos.
- **Cambio de fecha:** al consultar el nuevo día, sus casillas están desmarcadas y sus contadores diarios son 0; los registros de días anteriores permanecen y ya pertenecen al histórico. **No exige cron a medianoche, transferencia física, ni que la aplicación esté abierta.**
- **Integridad histórica:** renombrar o retirar una tarjeta de la lista activa nunca reduce pasos ya contabilizados de días cerrados. No se permite un borrado físico que destruya ese historial. El comportamiento de una tarea **marcada hoy y eliminada hoy** queda `[ABIERTO]` para el CRUD; no inferirlo.
- **Health:** tiene tres chequeos diarios independientes y no aporta pasos. Las casillas de hoy se inician vacías; el semáforo se **calcula** con la regla B, no se fuerza a rojo al comenzar el día.
- **Estado de implementación:** la etapa 06A incluye popups, edición temporal y frases de ejemplo, según el reporte de implementación del 24/11. Estos datos transitorios **no equivalen** a persistencia real ni a la integración obligatoria de la API de frases. El resultado local no puede certificarse desde este documento.

**Decisiones que permanecen:** tres escaleras; cuentas con tareas de ejemplo; límite de cuatro tareas activas por Activities/Learning; Health regla B; racha evaluada por días cerrados; fecha local; autenticación y RLS; API externa real y despliegue.

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
| Landing (`/`) | Logo, navegación pública, escalera, CTA hacia registro | Diseño aprobado |
| Sign Up / Log In | Email/contraseña, navegación de retorno, autenticación Supabase | Rutas públicas |
| Life (`/life`) | Hoy, total histórico, racha, días desde alta, secciones Health/Activities/Learning, frase del día | Privada; Life = Activities + Learning |
| Health (`/health`) | Semáforo textual y tres objetivos fijos | Privada; no suma pasos |
| Activities (`/activities`) | Tareas activas, pasos de hoy, total histórico, añadir y gestionar | Privada; máximo cuatro activas |
| Learning (`/learning`) | Mismas reglas de tareas y contadores que Activities | Privada; máximo cuatro activas |
| About (`/about`) | Misión del producto y presentación del autor | Pública |
| Popups | Edición de nombre, menú de tareas, diálogo de añadir, confirmaciones, tooltips | UI de 06A parcial; alta real pendiente |

Las cuatro escaleras comparten criterios visuales, pero **no** necesariamente la misma maquetación interna. Las páginas públicas mantienen sus propios márgenes. Diseño responsive a partir de 320 px; consultar mockups y CSS existente para detalles.

### Alcance y prioridades

**MVP comprometido:** rutas, Auth, CRUD de tareas por usuario, marcación por día, cálculos derivados, Health, API independiente de frases con carga/error/reintento, responsive, README, despliegue, pruebas RLS y PR. La entrega corresponde a **Etapa 1**, aunque utiliza Supabase como backend gestionado. La Etapa 2 (backend propio) no se está desarrollando.

**Fuera de alcance:** backend Express, MongoDB, JWT propio, notificaciones, analítica clínica, gamificación compleja y estadísticas no previstas.

Ante presión de tiempo, recortar mejoras estéticas o funciones P2 antes que seguridad RLS, API de frases, persistencia necesaria, deploy o PR.

---

## 02 · Especificación funcional y lógica

### 02.1 Rutas, sesión y seguridad

`/`, `/about`, `/signup`, `/login` son públicas. `/life`, `/health`, `/activities` y `/learning` requieren sesión. React Router controla acceso a vistas; **la privacidad de datos depende de RLS**, no de un guard de React. Restaurar sesión con mecanismos aprobados de Supabase y evitar estados de autenticación duplicados.

### 02.2 Definiciones normativas de los contadores [DECIDIDO]

**Paso:** una completación válida de una tarea de **Activities o Learning** para una fecha calendario local concreta. Una tarea puede aportar como máximo **un paso por día**, aunque se marque repetidamente.

**Fecha local actual (`todayLocalDate`):** `YYYY-MM-DD` calculado con la fecha del navegador. No usar `new Date().toISOString().slice(0, 10)` como fecha local, pues emplea UTC. La misma referencia de fecha local debe utilizarse en las tres páginas para una misma vista de progreso.

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

### 02.6 Integridad del historial y gestión de tareas [DECIDIDO / ABIERTO]

- Una tarea pertenece a una escalera (Activities o Learning) y puede completarse una vez por día.
- **[DECIDIDO] Nombre al confirmar:** al crear o renombrar con Submit, se aplica `trim()` y se convierte el primer carácter a mayúscula conservando el resto del texto tal como se escribió. Se rechaza un nombre que quede vacío. El borrador conserva el texto escrito.
- **[DECIDIDO] Renombrado efectivo:** si el nombre normalizado cambia respecto del confirmado, se conservan el ID, la escalera y el propietario. En la misma operación se elimina solo la completación de esa tarea para la fecha local actual, si existe. En ese caso, Today disminuye un paso en la escalera correspondiente y en Life. El histórico permanece intacto. Si se confirma el mismo nombre normalizado o la tarea ya está desmarcada, los contadores se mantienen. Cancel, Escape, clic exterior y envíos inválidos dejan intactas las completaciones.
- Cuentas nuevas reciben **una sola vez** las tareas de ejemplo: Activities — Gym, Read my Book, Guitar Practice; Learning — Learned something new, Studied a language, Studied music theory. No recrearlas automáticamente si el usuario las retira.
- Se permiten hasta **cuatro tareas activas por escalera**. Con una única tarea activa, el menú Settings **no ofrece Delete Card**, conforme a la interfaz de 06A. **Un estado vacío (0 tareas) aún debe poder representarse** si ocurre por carga, error, importación o datos preexistentes; no equivale a permitir borrar la última desde Settings.
- La acción visible puede llamarse **Delete Card**; esto **no autoriza** a borrar el historial de pasos. El modelo v2.1 propone `archived_at` como mecanismo interno para ocultar una tarea preservando sus completaciones. Mostrar o no la palabra «Archive» en UI es independiente de esa decisión técnica.
- **Prohibido como fallback automático:** borrar físicamente una tarea junto con sus completaciones históricas. La anterior frase «si es complejo, se borra definitivamente» queda **revocada** si causa pérdida de progreso. Cualquier nuevo mecanismo de eliminación requiere aprobación y revisión de esquema/RLS.
- **[ABIERTO] Eliminar hoy una tarjeta completada hoy:** aún no se decidió si el paso de hoy permanece o se revierte. Este caso afecta `today`, el histórico del siguiente día y potencialmente la racha. No implementarlo por suposición; resolverlo antes de CRUD persistente.
- El conteo exacto para la fecha actual en presencia de una tarjeta retirada durante ese mismo día depende del punto abierto anterior. Esta excepción **no** autoriza reinterpretar el resto de las fórmulas.
- La UI puede tener confirmación visual de eliminación; la confirmación por sí sola no implica que se haya escrito o archivado un registro real en Supabase.

### 02.7 Health — regla B [DECIDIDO]

Health tiene exactamente tres objetivos diarios fijos: **Good Nutrition, Good Sleep y Daily Movement**. Se marcan por fecha, con toda la tarjeta como área clicable. Sus marcas **no** suman pasos a ninguna escalera. Sus checkboxes están vacíos para la nueva fecha si aún no se registraron checks de ese día.

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
| `profiles` | `id` (FK `auth.users`), `display_name`, `created_at` | Perfil; nombre temporal del Header en 06A no representa una escritura persistida |
| `tasks` | `id`, `user_id`, `ladder` (`activities`/`learning`), `title`, `archived_at`, `created_at` | Identidad estable de tarea, estado activo/retirado; Health no usa esta tabla |
| `task_completions` | `id`, `user_id`, `task_id`, `completed_date` | Fuente de pasos diarios e históricos; `UNIQUE(task_id, completed_date)`; FK compuesta para impedir referencias de otra cuenta |
| `health_checks` | `user_id`, `date`, `nutrition`, `sleep`, `movement` | Una fila por fecha y persona; no cuenta como pasos |
| Derivados, **sin tabla propia** | `today`, `total`, estado Health, racha, días desde alta | Se calculan de registros y fecha de consulta; no se guardan como verdad duplicada |

**Integridad crítica:** la relación entre `tasks` y `task_completions` debe permitir preservar los registros históricos cuando una tarea deja de ser activa. No configurar ni ejecutar una eliminación en cascada que borre esos pasos. La v2.1 menciona `archived_at`; cualquier cambio de estrategia de borrado debe comprobar previamente claves foráneas, RLS e historial.

Las fechas se almacenan como días calendario `YYYY-MM-DD` según fecha local del usuario. No usar conversión UTC automática para decidir a qué día pertenece un check. La aplicación no está limitada a una zona horaria fija.

### 02.10 Quotes API — requisito externo de Etapa 1

Supabase guarda cuentas y datos personales, pero **no sustituye** la API de frases de terceros. Una API pública real debe consumirse mediante `fetch()` en `src/utils/quotesApi.ts`, con respuesta verificada y tipada, transformación al tipo interno `Quote`, carga, error con reintento y estado vacío.

**Proveedor [ABIERTO]:** DummyJSON (`/quotes/random`) fue candidato no verificado, no proveedor aprobado. Comprobar disponibilidad y CORS desde el navegador; documentar proveedor y límites en README. Ningún fallback local puede presentarse como respuesta real. Las variables `VITE_` son públicas.

**Interacción 06A aprobada:** tarjeta inicial «Today's quote for you is...» y botón «Click to reveal»; al revelar desaparecen ambos y se muestra solo la frase sobre la tarjeta exterior. La frase es aleatoria por fecha local y se mantiene durante la sesión al navegar; una nueva fecha puede seleccionar otra. **06A usa frases provisionales locales; aún queda pendiente sustituir su fuente por la API real sin romper esta interacción.**

### 02.11 Estado, persistencia y accesibilidad

- `useState` y estado compartido solo donde corresponda; tareas, completaciones y Health definitivos deben persistirse por cuenta en Supabase. Los componentes visuales no consultan Supabase directamente: usar hooks/utilidades tipados.
- Funciones puras para fechas, progreso, Health y racha. UI consistente en Life/Activities/Learning desde la misma fuente de completaciones por usuario y fecha.
- RLS en todas las tablas personales, verificada con dos cuentas; controlar carrera de solicitudes, respuestas antiguas tras cambio de cuenta y reversión de actualizaciones optimistas fallidas.
- Accesibilidad: `button`, `a`, `label`, teclado, foco visible, estados de carga/error, indicadores de color acompañados de texto, popups cerrables y formularios con validación.
- Responsive a partir de 320 px sin desbordamiento horizontal; no ocultar overflow como remedio para fallos de maquetación.

---

## 03 · Tecnologías, arquitectura y diseño

### Stack

- Vite + React + TypeScript; React Router para rutas públicas y privadas.
- CSS por componente/compartido, Flex/Grid, normalize o reset; `src/styles/variables.css` como fuente de la paleta.
- `@supabase/supabase-js` para Auth, datos PostgreSQL y RLS; ninguna clave de servicio en frontend.
- API externa de frases con Fetch nativo y tipos explícitos.
- Git/GitHub, ramas `stage-frontend` y `main`; despliegue en Vercel o Netlify con fallback para rutas SPA.

### Separación de responsabilidades

```text
UI React → hooks / estado compartido → cliente Supabase → PostgreSQL con RLS
UI React → utils/quotesApi.ts → fetch → API third-party de frases
Completaciones + fecha local → funciones puras de progreso → contadores derivados
Health checks (hoy/ayer) → función pura de regla B → semáforo
Días cerrados + pasos + Health → función pura de racha
```

Reutilizar componentes comunes de Activities y Learning. Estado local para formularios/popups; estado compartido solo para recursos que cruzan rutas. El sistema de popup 06A utiliza `EditBubble`, `LadderPopup`, `LadderTooltip` según reporte de implementación; la existencia real y el funcionamiento final se verifican en el repositorio local.

### Organización orientativa

`src/app/`, `src/pages/`, `src/components/`, `src/context/`, `src/hooks/`, `src/utils/` (`quotesApi`, `progress`, `dates`, `supabaseClient`), `src/types/`, `src/config/`, `src/styles/`, `src/images/`, `supabase/migrations/`, `docs/`.

No forzar renombrados para ajustarse a esta lista; prevalece el código existente cuando cumple el objetivo.

### Seguridad y configuración

Variables públicas posibles: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_QUOTES_API_URL` si aplica. Nunca exponer `service_role`, claves secretas o `.env`; mantener `.env.example` ficticio. La `anon key` pública no reemplaza políticas RLS. Confirmación de correo y URLs de redirección deben comprobarse en producción.

### Assets y calidad visual

Ilustraciones de producción en WebP, iconos/logo en SVG según conveniencia, decoración y fondos en CSS, textos y botones accesibles en HTML. Las fuentes preferidas son Patrick Hand y Kalam, con fallback de sistema. Mantener los mockups aprobados y el estilo orgánico sin introducir imágenes de texto innecesarias.

**Guía de vistas privadas:** márgenes laterales de Life, Activities y Learning alineados con Health. Preservar en tablet/móvil la ubicación de ilustraciones, evitando espacios verticales excesivos; el globo de edición del nombre debe centrarse en móvil sin perder la punta que apunta al lápiz. Estas observaciones son requisitos visuales; su cumplimiento final exige verificación real.

---

## 04 · Checklist de desarrollo y evaluación

### A · Condiciones críticas de entrega de TripleTen (Etapa 1)

- [ ] Entregar URL del PR `stage-frontend` → `main` antes del plazo.
- [ ] `npm install`, `npm run dev`, `npm run build` y `npm run lint` sin fallos.
- [ ] API third-party consumida realmente con `fetch()`, datos visibles y estados de carga/error.
- [ ] Aplicación desplegada y rutas internas recargables sin 404.
- [ ] README con nombre, propósito, stack, proveedor de API y URL pública.

### B · Calidad frontend

La rúbrica original incluye criterios de desempeño valorados en **4,21 puntos cada uno**, buenas prácticas de **1,5 puntos cada una** y recomendaciones de **1 punto cada una**; las categorías siguientes agrupan los requisitos para seguimiento, no sustituyen el documento oficial del curso.

- [ ] TypeScript consistente (incluidos iconos y componentes); componentes reutilizables y props tipadas; hooks fuera de condicionales/bucles; keys estables que no dependan del índice.
- [ ] Estructura de componentes, estilos, assets, utilidades, configuración y recursos externos clara; constantes organizadas en configuración; listeners limpiados al desmontar.
- [ ] Responsive desde 320 px, teclado/focus, semántica HTML, imágenes optimizadas con `alt`, fuentes conectadas con fallback de sistema, normalize/reset y contraste suficiente.
- [ ] Formularios con placeholder, required cuando corresponda, validación y foco; cuenta con estados carga/error y restauración de sesión; enlaces y botones semánticos.
- [ ] Ruta `/` y `/about`, más rutas protegidas y navegación funcional.
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
- [ ] Verificar que retirar una tarjeta activa conserva los pasos históricos. Resolver antes de implementar el retiro el caso de una tarjeta marcada hoy.
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

### Calendario base (referencia v2.1, no registro de ejecución)

| Fecha 2026 | Objetivo originalmente planeado | Cierre necesario |
|---|---|---|
| 22–23 nov. | Setup, rutas, Auth y vistas públicas | Dev/build/lint y rutas navegables |
| 24 nov. | Supabase, tablas, RLS, siembra | Aislamiento probado con dos cuentas |
| 25 nov. | Escaleras, popups, responsive | UI verificable desde 320 px |
| 26 nov. | CRUD, marcación diaria, contadores, Health y racha | Persistencia y pruebas de fechas/histórico |
| 27 nov. | `quotesApi.ts` e integración | Frase real con carga/error/reintento |
| 28 nov. | QA, README, deploy y PR | URL pública y PR si todo pasa |
| 29 nov. | Correcciones finales | PR enviado |
| 30 nov. | Margen para evaluación | Sin funciones nuevas |

**Reevaluar contra el repositorio real:** el calendario no certifica tareas completas. No sacrificar RLS ni la API real para terminar pulido estético.

### Flujo de trabajo

El propietario decide y aprueba cambios. ChatGPT/Codex ayuda a implementar y revisar; las propuestas de otras IA se subordinan a decisiones aprobadas. Tareas pequeñas y verificables, inspección de diff y pruebas antes de integrar. Nadie crea commits, hace push o merge sin autorización expresa.

---

## 06 · Validación, defensa y riesgos

### Defensa técnica

Una aplicación simple que presenta progreso diario e histórico sin prometer resultados clínicos. Como portafolio muestra React/TypeScript, accesibilidad, rutas, estado compartido, CRUD, autenticación, RLS, consumo de API externa y despliegue. Supabase es backend gestionado; no sustituye el requisito de Fetch API externa de TripleTen.

### Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Incluir pasos de hoy en históricos | Filtro estrictamente `completed_date < todayLocalDate`; pruebas lunes/martes |
| Duplicar totales al cambiar de día o abrir tras varios días | Derivar desde completaciones únicas fechadas; sin job nocturno ni acumulador redundante |
| Eliminar una tarea y perder histórico | Preservar completaciones; bloquear borrado físico destructivo; resolver caso de eliminación en el mismo día |
| Confundir reinicio de checks de Health con rojo automático | Evaluar regla B con hoy y ayer |
| Inconsistencia entre vistas | Una fuente de completaciones por cuenta y funciones puras compartidas |
| RLS insuficiente | Pruebas de aislamiento con dos usuarios y referencias cruzadas |
| API pública de frases fuera de servicio o CORS | Verificación temprana y proveedor alternativo aprobado |
| Limitaciones del plan gratuito Supabase o email de confirmación | Verificar configuración y disponibilidad antes de revisión |
| Desbordamiento móvil y popups | Verificar desde 320 px y teclado; no ocultar overflow como arreglo |
| Documentos del repo con reglas antiguas | Sincronizar `AGENTS.md`, la skill Architecture Guardian y plan **en tarea posterior aprobada** |
| Tiempo insuficiente para requisitos obligatorios | Priorizar P0, congelar pulidos opcionales y desplegar con margen |

### Validación no certificada

Esta versión es **una especificación documental**, no evidencia de pruebas de producción. Quedan por certificar en el código: operaciones reales de Supabase, RLS entre usuarios, fórmula de totales, cambio de fecha, API de frases real, estados de error, responsive, build, lint, deploy y PR.

---

## 07 · Histórico de decisiones y vigencia

### 19–21 de noviembre de 2026 — Origen

- [DECIDIDO] Proyecto final TripleTen Etapa 1; React/TypeScript/Vite; diseño de escaleras en inglés; paleta verde `#005C3C`, crema `#FDF2E5` y naranja `#FF891C`.
- [CORRECCIÓN] Se descarta persistencia exclusivamente local y Open Library como eje del proyecto; Supabase gestiona cuentas y datos y una API pública separada debe entregar frases. Sin Express ni MongoDB.
- [DECIDIDO] Mockups y enfoque visual; fondos en CSS y arte de escalera optimizado.

### 22 de noviembre de 2026 — Dossier v2.1

- [DECIDIDO] Life suma Activities y Learning; Health no suma pasos.
- [DECIDIDO] Health regla B, racha de días cerrados, cuentas con tareas de ejemplo una sola vez, fecha calendario local.
- [PROP en su momento] `archived_at` como mecanismo de retirar tareas; el dossier anterior permitía borrado definitivo como fallback de plazo. **Esta alternativa queda limitada por la exigencia posterior de preservar el histórico.**
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
- [ABIERTO] Destino de una completación de hoy si la tarjeta se elimina antes de terminar ese día; debe resolverse antes del CRUD persistente.

### Referencias

Requisitos de TripleTen Etapa 1 (API externa con Fetch), mockups 01–07 y popups, paleta y `variables.css`, `AGENTS.md`, Architecture Guardian y dossier v2.1. Esta actualización se basa en la explicación y confirmación directa del propietario sobre los contadores.

**Regla final para futuras implementaciones:** en caso de contradicción entre el relato histórico y las secciones normativas 02.2–02.6, prevalecen estas últimas y cualquier instrucción posterior explícita del propietario.
