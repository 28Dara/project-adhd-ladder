# ADHD Ladder — Plan de trabajo v2.2

> **Documento completo para reemplazar `docs/plan-de-trabajo.md`.** Actualizado el 24 de noviembre de 2026. Fuente normativa: `docs/dossier.md` v2.2. Este plan organiza el trabajo; **no sustituye las reglas del dossier ni acredita pruebas por sí mismo**.

**Producto:** ADHD Ladder · **Entrega:** TripleTen Etapa 1 · **Stack:** React + TypeScript + Vite + React Router + Supabase Auth/PostgreSQL/RLS + API de frases separada por `fetch()` · **Plazo:** 30/11/2026 · **Meta:** PR `stage-frontend` → `main` 28–29/11.

## 1. Reglas de trabajo y estado verificable

- Antes de ejecutar cualquier etapa, inspeccionar el árbol **local actual**, `git status`, el dossier pertinente, `AGENTS.md` y Architecture Guardian según el alcance. La rama remota puede ir detrás de cambios no subidos.
- Los reportes de Codex sobre 06A son indicios de trabajo realizado, **no evidencia independiente de pruebas**. No marcar una etapa como completa hasta verificar el código y su resultado.
- No crear ramas, hacer commit, push, merge, ejecutar migraciones o eliminar datos sin autorización explícita.
- Prioridad de decisiones: instrucción más reciente del propietario > `[DECIDIDO]` dossier v2.2 > este plan > propuestas `[PROP]`. No implementar puntos `[ABIERTO]` por suposición.
- Mantener cambios pequeños, revisables y con verificación; no sacrificar funcionalidades obligatorias por pulido visual.

## 2. Estado de avance al 24 de noviembre (no certificado)

| Área | Estado de trabajo conocido | Prueba/cierre requerido |
|---|---|---|
| Setup, rutas y maquetación Etapa 05 | Realizada/revisada parcialmente en local según reportes anteriores | Build, lint y prueba visual final de las cuatro escaleras |
| Auth y rutas privadas | Implementación reportada, con flujos React/Supabase | Verificar registro, login, logout, restauración y redirects con cuenta real |
| 06A popups | Edición temporal, tooltips, menús, Health clicable y quote local | Comprobaciones funcionales en QA |
| 06A.1 visual | Páginas actuales aprobadas visualmente por el propietario | Cerrado por el propietario |
| Supabase, SQL y RLS | Migraciones planeadas/escritas; aplicación y pruebas cruzadas no certificadas | Revisar esquema y RLS, aplicar con autorización, probar dos cuentas |
| CRUD de tareas y checks persistidos | Pendiente por verificar/implementar | Crear, renombrar, retirar, marcar y desmarcar con persistencia |
| Contadores v2.2 | 06B-03 aprobado y commiteado por el propietario | QA con persistencia cuando corresponda |
| API externa de frases | **No conectada** en 06A; frases de ejemplo | API real por `fetch`, tipado, carga/error/reintento y vacío |
| Deploy / README / PR | Pendiente de verificación | URL pública, sin 404 al recargar, README y PR a tiempo |

No reemplazar estados "pendiente de verificar" por "hecho" sin evidencia del proyecto.

## 3. Orden operativo restante (una tarea revisable por vez)

### A. Cierre de regresiones visuales 06A.1

**Completado por aprobación visual del propietario.** La aprobación de las páginas actuales cierra las regresiones reportadas de la ilustración de Life y el globo de nombre en móvil como objetivos de esta sección.

#### 06A.1-DROPDOWN-01 · Cierre del selector de escaleras por clic exterior

- **Estado** — Completado, aprobado y commiteado por el propietario.
- **Objetivo y alcance** — Cerrar `LadderSelector` al hacer clic fuera y conservar el comportamiento del selector y de los popups existentes.
- **Aceptación** — El mouse y el toque exterior cierran el selector. Escape, pulsar de nuevo el control y elegir una opción conservan su comportamiento. Un clic interior sin selección mantiene el menú abierto. El listener se retira al desmontar. Build, lint y formato pasan. La verificación visual corresponde al propietario.
- **Skills** — `architecture-guardian` y `ub-mode`.
- **Verificación técnica** — Build, lint y formato pasaron. En Edge sin interfaz, el código anterior reprodujo el fallo de clic exterior y el ajuste pasó las comprobaciones de cierre, selección y retirada del listener con eventos simulados. El propietario aprobó el resultado y confirmó que la prueba en un dispositivo físico no es un requisito del proyecto.
- **Commit propuesto** — `fix(navigation): close ladder dropdown on outside click`.

#### 06A.1-HEALTH-01 · Estados visuales de las casillas de Health (P1)

- **Estado** — Completado, aprobado y commiteado por el propietario.
- **Objetivo y alcance** — Reutilizar la apariencia compartida de `.ladder-check` en Health y conservar el área clicable y el foco visible.
- **Aceptación** — Casilla desmarcada vacía, casilla marcada verde con palomita y dimensiones y posición conservadas. Build, lint y formato pasan. La revisión visual corresponde al propietario.
- **Skills** — `architecture-guardian` y `ub-mode`.
- **Verificación técnica** — Build, lint y formato pasaron. En Edge sin interfaz se reprodujo la X anterior y se comprobaron los estilos de ambos estados, las dimensiones y la posición al marcar, el foco visible y el clic en la etiqueta.
- **Commit propuesto** — `fix(health): simplify checkbox visual states`.

#### 06A.1-ADD-CARD-01 · Dimensiones del botón de alta tras el retiro (P1)

- **Estado** — En revisión del propietario.
- **Commit local verificado** — `5e3c814`.
- **Objetivo y alcance** — Centrar el botón de alta en su espacio y conservar su ancho y altura responsive base en el CSS compartido de Activities y Learning.
- **Aceptación** — De cero a tres tarjetas, el botón conserva sus dimensiones a cada ancho y queda centrado en ambos ejes. Con cuatro tarjetas se mantiene oculto. Las tarjetas y los popups conservan su geometría y comportamiento.
- **Skills** — `architecture-guardian` y `ub-mode`.
- **Verificación técnica** — Pasaron build, lint y formato. En Edge sin interfaz se comprobaron cero a cuatro tarjetas en ambas rutas a 320, 375, 640, 768, 1024, 1280 y 1440 px. Se verificaron dimensiones, centrado, ausencia de overflow horizontal, geometría de tarjetas y anclaje y cierre del popup con retorno de foco. La revisión visual corresponde al propietario.
- **Commit propuesto** — `fix(ladders): preserve add card button dimensions`.

### B. Decisiones aprobadas sobre el retiro de tareas

**Completado por decisión del propietario.** `Delete Card` archiva mediante `archived_at` y elimina solo la completación de hoy. La regla vigente y la conservación del histórico están en el dossier §02.6. El cierre de la decisión habilita 06B-05 en memoria. La revisión de RLS, claves foráneas e integridad en la base de datos corresponde al apartado C.

### C. Datos y seguridad Supabase (P0)

- [ ] Revisar migraciones existentes contra dossier v2.2, especialmente `tasks`, `task_completions`, `health_checks`, unicidad `(task_id, completed_date)`, FK compuesta y **ausencia de cascada destructiva de historial**.
- [ ] Revisar políticas RLS de SELECT, INSERT, UPDATE, DELETE por propietario en cada tabla personal, incluyendo referencias cruzadas.
- [ ] Aplicar migraciones **solo después de autorización**, comprobar esquema real, probar aislamiento con dos cuentas y errores de red.
- [ ] Definir/verificar siembra de las seis tareas de ejemplo **una sola vez** para cada cuenta. No resembrar si el usuario retira tareas.

**Cierre:** persistencia real y RLS comprobadas en dos cuentas, sin pérdida de historial.

### D. 06B — Frontend funcional y persistencia (P0/P1)

#### 06B-01 · Fuente compartida de tareas y completaciones

- **Estado** — Completado, aprobado y commiteado por el propietario.
- **Objetivo y alcance** — Dar a Activities y Learning acceso al mismo estado de tareas y completaciones provisionales tipadas, disponible para Life en un objetivo posterior. El frontend provisional de este objetivo precede a la conexión con Supabase.
- **Aceptación** — Cada ruta puede leer los datos al entrar directamente. Cada tarea tiene identidad estable por cuenta y una escalera. Cada completación identifica su tarea y fecha local. Diseño 06A conservado, estado en memoria y contrato reutilizable con Supabase. Build, lint y formato pasan.
- **Skills** — `architecture-guardian` y `ub-mode`.
- **Verificación técnica** — Build, lint y formato pasaron. Una prueba de renderizado de rutas directas y de los datos provisionales comprobó los checks deshabilitados, las identidades estables, la separación por cuenta y la fecha local. La revisión visual corresponde al propietario.
- **Commit propuesto** — `feat(ladders): establish shared task state`.

#### 06B-02 · Marcación diaria de tareas en memoria (P0)

- **Estado** — Completado, aprobado y commiteado por el propietario.
- **Objetivo y alcance** — Habilitar la marcación y desmarcación en Activities y Learning desde `useTasks()` y el estado del layout privado. Las completaciones son la fuente del estado de las casillas.
- **Aceptación** — Una completación por tarea y fecha local. Desmarcar elimina solo la del día actual. Los registros históricos permanecen intactos. Las casillas reflejan los datos al navegar y al cambiar de fecha. El estado está aislado por cuenta. Build, lint y formato pasan. La revisión visual corresponde al propietario.
- **Skills** — `architecture-guardian` y `ub-mode`.
- **Verificación técnica** — Build, lint y formato pasaron. En Edge sin interfaz se verificaron marcación, desmarcación, actualizaciones consecutivas sin duplicados, historial intacto, navegación privada, cambio de fecha y aislamiento al cambiar de cuenta.
- **Commit propuesto** — `feat(tasks): enable daily task completion`.

#### 06B-06A · Estado compartido y marcación diaria de Health (P1)

- **Estado** — Completado, aprobado y commiteado por el propietario.
- **Objetivo y alcance** — Conservar en memoria los tres objetivos de Health por cuenta y fecha local durante la navegación privada. Este objetivo se adelanta a los contadores del apartado E y resuelve la pérdida de checks al volver a Health. El semáforo se aborda en 06B-06B.
- **Aceptación** — Las tres casillas se marcan y desmarcan de forma independiente. Un día sin registros empieza vacío. La navegación, las actualizaciones consecutivas y el cambio de fecha conservan los valores que correspondan sin mezclar cuentas ni generar pasos. El contrato coincide con `health_checks`. Build, lint y formato pasan. La revisión visual corresponde al propietario.
- **Skills** — `architecture-guardian` y `ub-mode`.
- **Verificación técnica** — Edge sin interfaz reprodujo la pérdida de checks del código anterior. Con el ajuste se verificaron marcación, desmarcación, navegación, cambios consecutivos, cambio de día, conservación del historial, aislamiento por cuenta y separación de las completaciones de tareas.
- **Commit propuesto** — `feat(health): establish shared daily health state`.

#### 06B-04 · Creación y renombrado de tareas en memoria (P0)

- **Estado** — Completado, aprobado y commiteado por el propietario después del cierre de 06B-03.
- **Objetivo y alcance** — Habilitar el alta y renombrado de tarjetas en Activities y Learning con los formularios aprobados. El título confirmado vive en la tarea. Los borradores se conservan durante la navegación privada hasta que se confirman o se cancelan.
- **Aceptación** — El límite de cuatro tarjetas activas se aplica por escalera en la interfaz y en la operación. Se puede crear desde una lista vacía. El alta genera un ID estable y la tarjeta aparece desmarcada. Submit normaliza el nombre según el dossier §02.6. Un renombrado efectivo conserva la identidad y el histórico, y elimina solo la completación de hoy si existe. El mismo nombre normalizado conserva la marca. Escape y clic exterior conservan los borradores. Cancel los descarta. Se verifica el aislamiento por cuenta y el funcionamiento de los contadores.
- **Skills** — `architecture-guardian` y `ub-mode`.
- **Verificación técnica** — Pasaron build, lint y formato. Las pruebas de las mutaciones y de Edge sin interfaz cubrieron el alta desde cero y hasta el límite, los borradores, el foco, la navegación y el cambio de cuenta. También se verificaron la normalización al confirmar, la desmarcación por renombrado efectivo, la conservación del check ante un nombre equivalente, las operaciones consecutivas, el efecto en Today y Total y la independencia de Health. La revisión visual corresponde al propietario.
- **Commit propuesto** — `feat(tasks): enable task creation and renaming`.

#### 06B-05 · Retiro de tareas en memoria (P0)

- **Estado** — Completado, aprobado y commiteado por el propietario.
- **Objetivo y alcance** — Habilitar la confirmación existente de `Delete Card` en Activities y Learning y retirar tarjetas según el dossier §02.6. El estado se mantiene en memoria por cuenta.
- **Aceptación** — Confirmar archiva y quita solo la completación de hoy. Cancel, Escape y clic exterior conservan la tarjeta. El histórico sigue disponible, el retiro libera espacio en su escalera y la operación protege la última tarjeta activa ante solicitudes consecutivas. Una tarjeta nueva con el mismo nombre empieza desmarcada y recibe un ID propio. Navegación, contadores, aislamiento entre cuentas y Health se verifican dentro del flujo afectado.
- **Skills** — `architecture-guardian` y `ub-mode`.
- **Verificación técnica** — Pasaron build, lint y formato. Las pruebas del dominio y de Edge sin interfaz cubrieron el retiro de tarjetas marcadas y desmarcadas, la fecha local, el histórico, ambos límites, solicitudes consecutivas, reemplazo con el mismo nombre, navegación, aislamiento entre cuentas y separación de Health. Pasaron las comprobaciones de regresión de alta, renombrado y contadores. La revisión visual corresponde al propietario.
- **Commit propuesto** — `feat(tasks): enable task archival`.

#### CRUD y casillas persistentes

- [ ] Conectar el alta y el renombrado de 06B-04 a la persistencia por cuenta. Verificar el límite de cuatro activas, la normalización del título y la aplicación conjunta del renombrado y la desmarcación de hoy conforme al dossier §02.6.
- [ ] Implementar marcación y desmarcación por **fecha local**; una completación por tarea por día; gestionar errores y rollback de operaciones optimistas.
- [ ] Conectar el retiro de 06B-05 a la persistencia según el dossier §02.6. Verificar que el archivo y la desmarcación de hoy se apliquen juntos y que el historial permanezca disponible.
- [ ] Mantener Health en sus tres metas fijas, con datos fechados independientes de tareas Activities/Learning.

**Cierre:** operaciones correctas tras navegación, recarga y cambio de cuenta; no duplicados; estados vacío/carga/error accesibles.

### E. 06B — Contadores y fechas v2.2 (P0)

#### 06B-03 · Contadores derivados de pasos (P0)

- **Estado** — Completado, aprobado y commiteado por el propietario después del cierre de 06B-06A.
- **Objetivo y alcance** — Derivar los contadores de Life, Activities y Learning y los indicadores de sus tarjetas desde las completaciones en memoria. El historial conserva la escalera de las tareas archivadas según el dossier §02.6.
- **Aceptación** — Today y Total usan la fecha local y los cortes del dossier v2.2. Las escaleras se calculan de forma independiente y Life las suma. Los registros futuros y duplicados quedan fuera del conteo. Health no aporta pasos. Se admite acceso directo a cada ruta. Build, lint y formato pasan. La revisión visual corresponde al propietario.
- **Skills** — `architecture-guardian` y `ub-mode`.
- **Verificación técnica** — Pasaron las pruebas del cálculo puro, incluido el ejemplo lunes a martes con histórico Life de 20 a 23. En Edge sin interfaz se verificaron acceso directo, checks, contadores, indicadores, navegación, día nuevo, ausencia de completaciones, independencia de Health y cambio de cuenta. Build, lint y formato pasaron.
- **Commit propuesto** — `feat(progress): derive ladder step counters`.

Fórmulas únicas de aceptación:

```text
activitiesToday = completaciones de Activities con completed_date === hoyLocal
learningToday   = completaciones de Learning con completed_date === hoyLocal
lifeToday       = activitiesToday + learningToday

activitiesTotal = completaciones de Activities con completed_date < hoyLocal
learningTotal   = completaciones de Learning con completed_date < hoyLocal
lifeTotal       = activitiesTotal + learningTotal
```

- [x] Derivar los contadores en `utils/progress.ts` y reutilizar el servicio de fecha local.
- [x] Marcar suma hoy +1, desmarcar resta hoy −1; hoy no altera totales históricos. Life suma los **números**, no el número de SectionCards.
- [x] Cambio de día: nuevo día inicia sin checks y diarios cero si aún no hay completaciones; los registros anteriores **ya** entran al histórico, sin moverlos ni borrar datos, ni cron de medianoche.
- [ ] Verificar retorno tras varios días sin abrir aplicación, zona horaria local coherente, cambio de ruta/cuenta, eventos duplicados.
- [x] Prueba de referencia: lunes histórico Activities 8, Learning 12, Life 20; Learning marca tres -> Life hoy 3, Life total 20. Martes sin nuevos checks -> Life hoy 0, Learning total 15, Life total 23.
- [ ] Verificar renombrado y retiro según el dossier §02.6 en QA con persistencia.

**Cierre:** coinciden todas las vistas y pruebas de días cerrados sin duplicación.

### F. Health, racha y días desde alta (P0/P1 según dossier)

#### 06B-06B · Semáforo de Health mediante regla B (P1)

- **Estado** — Completado, aprobado y commiteado por el propietario.
- **Objetivo y alcance** — Derivar el semáforo compartido de Health y Life a partir de los registros diarios de 06B-06A y la fecha de alta de Auth. Aplicar la regla B del dossier §02.7 con fechas calendario locales.
- **Aceptación** — Ambas rutas muestran el mismo color y texto, incluso al entrar directamente a Life. Los checks y el cambio de fecha actualizan el resultado. El estado queda derivado y separado de los pasos. El diseño conserva el indicador circular.
- **Skills** — `architecture-guardian` y `ub-mode`.
- **Verificación técnica** — Pasaron build, lint y formato. Las pruebas del cálculo cubrieron 162 combinaciones y límites del calendario local. Edge sin interfaz verificó acceso directo a Life, marcación y desmarcación, navegación, cambio de fecha, historial, aislamiento de cuentas e independencia de los pasos. La revisión visual corresponde al propietario.
- **Commit propuesto** — `feat(health): derive daily health status`.

#### 06B-RESET-01 · Inicio sin progreso simulado

- **Estado** — En revisión del propietario.
- **Commit local verificado** — `773523b`.
- **Objetivo y alcance** — Conservar las seis tareas predeterminadas, iniciar sin completaciones ni registros de Health y retirar los valores de demostración de racha, antigüedad y fecha de alta.
- **Aceptación** — Today, Total y Streak comienzan en cero. Tareas y objetivos de Health comienzan desmarcados. La fecha visible usa `created_at` de Auth y, si falta, muestra la fecha local como simulada. Days in the ladder muestra un guion hasta 06B-07. La regla B y las interacciones siguen funcionando.
- **Skills** — `architecture-guardian` y `ub-mode`.
- **Verificación técnica** — En Edge sin interfaz se comprobaron inicio vacío, tareas predeterminadas, contadores al marcar y desmarcar, cambio de día, fecha real y simulada, cambio de cuenta y regla B. La revisión visual corresponde al propietario.
- **Commit propuesto** — `fix(previews): remove simulated progress records`.

#### 06B-07 · Racha y días desde el alta (P1)

- **Estado** — Completado, aprobado por el propietario.
- **Commit local verificado** — `708511f`.
- **Objetivo y alcance** — Derivar la racha de Life y la antigüedad de Life, Activities y Learning según el dossier §02.8. Reutilizar las completaciones, la regla B y la fecha de registro disponible en Auth.
- **Aceptación** — La racha excluye hoy y respeta los incrementos, descansos y reinicios. El historial incluye tareas archivadas. La antigüedad cuenta días calendario locales e incluye el alta. Cuando falta el alta real, la fecha simulada queda identificada y es estable durante la sesión.
- **Skills** — `architecture-guardian` y `ub-mode`.
- **Verificación técnica** — Pasaron build, lint y formato. Se comprobaron 12 escenarios de racha, seis casos de calendario y la regresión de contadores. Edge sin interfaz verificó inicio vacío, navegación, cambio de día, aislamiento entre cuentas y fecha simulada estable. La revisión visual corresponde al propietario.
- **Commit** — `feat(progress): implement streak and days in ladder calculations`.

#### AUD-02-01 · Sincronización de las acciones con el día local (P1)

- **Estado** — En revisión del propietario.
- **Objetivo y alcance** — Compartir la referencia de fecha del layout privado entre las vistas y las acciones diarias. Resolver cada pulsación con los registros del día vigente, incluso si el temporizador se retrasa.
- **Aceptación** — La primera pulsación después de medianoche funciona en ambas escaleras y en Health. Las acciones conservan el historial, los indicadores siguen las reglas del dossier y la fecha se actualiza al recuperar foco o visibilidad.
- **Skills** — `architecture-guardian` y `ub-mode`.
- **Verificación técnica** — Pasaron build, lint, formato y `git diff --check`. En Edge sin interfaz se reprodujo el fallo previo y se comprobó su corrección con reloj simulado. Pasaron los casos de medianoche, temporizador retrasado, foco, visibilidad, pulsaciones consecutivas, historial, indicadores y aislamiento. También se verificaron creación, renombrado, retiro y la frase provisional. Las pruebas aisladas cubrieron 162 combinaciones de Health y 4.096 secuencias de racha. La revisión visual corresponde al propietario.
- **Commit propuesto** — `fix(dates): synchronize daily actions with the displayed day`.

**Cierre:** reglas Health B y racha probadas de forma independiente de contadores históricos.

### G. API third-party de frases (P0)

- [ ] Verificar un proveedor público desde navegador (respuesta real, CORS, límites, sin exponer claves); no asumir que DummyJSON fue aprobado.
- [ ] Implementar `src/utils/quotesApi.ts` con `fetch`, tipos del payload **real** y adaptación al tipo interno Quote.
- [ ] Life: `Today's quote for you is...` + `Click to reveal`; mostrar frase real, una aleatoria por fecha local durante la sesión; carga, error, reintento y vacío sin fingir que un fallback viene de API.
- [ ] Mantener quote separada de Supabase y documentar proveedor y limitaciones en README.

**Cierre:** frase real visible en navegador y estados de fallo comprobados.

### H. QA, deploy y entrega (P0)

- [ ] Verificar todas las rutas, formularios, menús, teclado/focus, accesibilidad y responsive >=320 px sin scroll horizontal.
- [ ] Probar Auth real y RLS con dos cuentas en entorno de despliegue; recarga SPA sin 404; verificación de errores y estados vacíos.
- [ ] Ejecutar `npm run dev`, `npm run build`, `npm run lint`, `npm run format:check` y `git diff --check` donde apliquen; registrar resultados, no afirmarlos sin ejecutar.
- [ ] README con propósito, stack, instalación, variables públicas, URL desplegada y proveedor de frases; `.env` y secretos fuera de repo.
- [ ] Crear PR `stage-frontend` → `main`, compartir la **URL del PR**, no solo la del repositorio. Integrar únicamente con autorización del propietario.

**Cierre:** release desplegado, verificado y PR enviado antes de 30/11.

## 4. Calendario objetivo y contingencias

| Fecha (2026) | Enfoque prioritario | Nota |
|---|---|---|
| Mar 24 | Sincronizar documentos y revisar el retiro en memoria según la regla aprobada | No confundir edición documental con aplicación de SQL |
| Mié 25 | Datos, RLS, CRUD y contadores v2.2 según estado real | Concentrar tiempo en P0; dividir en cambios revisables |
| Jue 26 | Cerrar CRUD, Health/racha y pruebas de fechas | Resolver los casos críticos antes del pulido |
| Vie 27 | Quotes API externa real, errores y README | No dejar API obligatoria como fallback local |
| Sáb 28 | QA, deploy, revisión en producción y PR | Meta principal de entrega |
| Dom 29 | Correcciones y envío del PR si aún falta | Evitar funciones nuevas |
| Lun 30 | Margen de evaluación | No dejar entregables obligatorios pendientes |

El calendario es una guía, **no una declaración de trabajo completado**, y debe adaptarse a evidencia local. La disponibilidad de horas original era aproximada (3 h días laborales; 7 h miércoles y sábado), no una garantía.

## 5. Qué recortar y qué no

- **Recortable:** animaciones, refinamientos estéticos, estadísticas avanzadas y otras mejoras P2. Mantener la UI 06A funcional ya realizada, pero no ampliarla sin necesidad.
- **No recortable:** pasos diarios e históricos correctos, Auth, aislamiento RLS, CRUD esencial sin pérdida histórica, API real de terceros con fetch, rutas obligatorias, build/lint, deploy, README y PR.
- Si hay un bloqueo de seguridad o de decisión de producto, informar la dependencia; no resolverlo mediante borrado de historial ni dejando RLS desactivada.

## 6. Flujo de trabajo y arranque de tarea

1. Elegir una sola tarea con cierre verificable y revisar el estado real; consultar `AGENTS.md`, Architecture Guardian cuando aplique y la sección del dossier pertinente.
2. Indicar propósito, archivos afectados, reglas y pruebas antes de editar.
3. Implementar el cambio mínimo sin crear ramas/commits/push/merge salvo autorización del propietario.
4. Revisar diff, correr pruebas pertinentes y reportar evidencia, archivos y asuntos abiertos.
5. Detenerse para revisión del propietario antes de iniciar otra funcionalidad.

**Instrucción corta para Codex:** «Proyecto ADHD Ladder, TripleTen Etapa 1. `docs/dossier.md` v2.2 es la fuente normativa; `AGENTS.md` y Architecture Guardian son instrucciones operativas. Para `Your total steps` solo cuentan `completed_date < todayLocalDate`; Life es la suma Activities + Learning y Health no suma pasos. Aplica la regla aprobada de retiro en §02.6 y conserva el historial. Trabaja solo en la tarea indicada, sin commits, push, merge, migraciones ni nuevas dependencias sin autorización. Describe cambios y pruebas reales».

### DOC-01 · Actualización del flujo de desarrollo y revisión

- **Estado** — Completado, aprobado y commiteado por el propietario.
- **Objetivo y alcance** — Actualizar `AGENTS.md` con el orden de desarrollo, las responsabilidades de verificación, los niveles de análisis, el flujo Git y la separación del estado por dominio. Alinear las reglas de edición de tareas con el dossier vigente durante DOC-01.
- **Aceptación** — Diff documental limitado a `AGENTS.md`, con el flujo y las restricciones vigentes preservados. Se revisó el diff completo y pasó `git diff --check`.
- **Skills** — `architecture-guardian` y `ub-mode`.
- **Commit propuesto** — `docs(agents): update development and review workflow`.
