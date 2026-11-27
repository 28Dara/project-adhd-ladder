# ADHD Ladder — Plan de trabajo v2.7

> **Actualizado el 25 de noviembre de 2026.** [Dossier v2.6](dossier.md) como fuente normativa. El plan organiza entregables, dependencias y evidencia de ejecución.

**Producto:** ADHD Ladder · **Entrega:** TripleTen Etapa 1 y preparación de Etapa 2 · **Stack:** React, TypeScript, Vite, React Router, Node.js, Express, Supabase Auth, npm Workspaces y Fetch nativo para DummyJSON · **Plazo:** 30/11/2026 · **Meta:** PR de Etapa 1 el 28–29/11 o antes si queda listo. Confirmar el plazo aplicable a Etapa 2.

## 1. Reglas de trabajo y estado verificable

- Antes de ejecutar una etapa, inspeccionar el árbol **local actual**, `git status` y las secciones pertinentes del dossier. Seleccionar skills y modos según `AGENTS.md`. Los objetivos ya ejecutados conservan el registro de las skills usadas.
- Los reportes de Codex sobre 06A son indicios de trabajo realizado, **no evidencia independiente de pruebas**. No marcar una etapa como completa hasta verificar el código y su resultado.
- No crear ramas, hacer commit, push, merge, ejecutar migraciones o eliminar datos sin autorización explícita.
- Prioridad de decisiones: instrucción más reciente del propietario > `[DECIDIDO]` del dossier vigente > este plan > propuestas `[PROP]`. Solicitar decisión sobre los puntos `[ABIERTO]`.
- Mantener cambios pequeños, revisables y con verificación; no sacrificar funcionalidades obligatorias por pulido visual.

## 2. Línea base local al 25 de noviembre

| Área | Estado de trabajo conocido | Prueba/cierre requerido |
|---|---|---|
| Árbol local | `stage-frontend` en `a04c426` al iniciar 07-PRES, once commits por delante de la referencia local de origen. Cliente y servidor en workspaces separados. | Conservar las fuentes académicas locales y revisar el árbol antes de intervenir |
| Setup, rutas y maquetación Etapa 05 | Realizada/revisada en fase 06 según reportes previos | Build, lint y prueba visual final de las cuatro escaleras |
| Auth y rutas privadas | `AuthProvider` usa Supabase en la línea base. Layout por cuenta y ajuste de `/` en 07-ROOT. | Conservar el proveedor y cerrar la comprobación real de registro, login, logout, restauración y rutas en 07-10 |
| 06A popups | Edición temporal, tooltips, menús, Health clicable y quote local | Comprobaciones funcionales en QA |
| 06A.1 visual | Páginas actuales aprobadas visualmente por el propietario | Cerrado por el propietario |
| Persistencia | La elección de Etapa 2 queda abierta. El estado de producto vive en memoria y las tres migraciones SQL se conservan. | Aclarar requisitos en la tutoría del 26/11/2026 y registrar la decisión posterior |
| CRUD de tareas y checks persistidos | Implementados en memoria. API Express pendiente. | Crear, renombrar, retirar, marcar y desmarcar con persistencia |
| Contadores v2.2 | 06B-03 aprobado y commiteado por el propietario | QA con persistencia cuando corresponda |
| 06B y API externa de frases | Cerradas y aprobadas. DummyJSON verificado en navegador local | Verificar desde el origen de producción |
| Deploy / README / PR | Pendientes | URL pública cuando corresponda, recarga SPA y README. PR separado para cada etapa |

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

- **Estado** — Completado, aprobado por el propietario.
- **Commit local verificado** — `5e3c814`.
- **Objetivo y alcance** — Centrar el botón de alta en su espacio y conservar su ancho y altura responsive base en el CSS compartido de Activities y Learning.
- **Aceptación** — De cero a tres tarjetas, el botón conserva sus dimensiones a cada ancho y queda centrado en ambos ejes. Con cuatro tarjetas se mantiene oculto. Las tarjetas y los popups conservan su geometría y comportamiento.
- **Skills** — `architecture-guardian` y `ub-mode`.
- **Verificación técnica** — Pasaron build, lint y formato. En Edge sin interfaz se comprobaron cero a cuatro tarjetas en ambas rutas a 320, 375, 640, 768, 1024, 1280 y 1440 px. Se verificaron dimensiones, centrado, ausencia de overflow horizontal, geometría de tarjetas y anclaje y cierre del popup con retorno de foco. La revisión visual corresponde al propietario.
- **Commit propuesto** — `fix(ladders): preserve add card button dimensions`.

### B. Decisiones aprobadas sobre el retiro de tareas

**Completado por decisión del propietario.** `Delete Card` archiva mediante `archived_at` y elimina solo la completación de hoy. La regla vigente y la conservación del histórico están en el dossier §02.6. El cierre de la decisión habilitó 06B-05 en memoria. La verificación de atomicidad e aislamiento persistidos corresponde a Etapa 2 y queda suspendida.

### D. 06B — Frontend funcional y persistencia (P0/P1)

#### 06B-01 · Fuente compartida de tareas y completaciones

- **Estado** — Completado, aprobado y commiteado por el propietario.
- **Objetivo y alcance** — Dar a Activities y Learning acceso al mismo estado de tareas y completaciones provisionales tipadas, disponible para Life en un objetivo posterior. El frontend de este objetivo preparó el contrato para la persistencia.
- **Aceptación** — Cada ruta puede leer los datos al entrar directamente. Cada tarea tiene identidad estable por cuenta y una escalera. Cada completación identifica su tarea y fecha local. Diseño 06A conservado, estado en memoria y contrato reutilizable con la persistencia. Build, lint y formato pasan.
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

#### 06B-06B · Semáforo de Health mediante regla B (P1, histórico)

- **Estado** — Completado, aprobado y commiteado por el propietario.
- **Objetivo y alcance** — Derivar el semáforo compartido de Health y Life a partir de los registros diarios de 06B-06A y la fecha de alta de Auth. Aplicar la regla B vigente en 06B. 07-10A la sustituye por la progresión diaria del dossier §02.7.
- **Aceptación** — Ambas rutas muestran el mismo color y texto, incluso al entrar directamente a Life. Los checks y el cambio de fecha actualizan el resultado. El estado queda derivado y separado de los pasos. El diseño conserva el indicador circular.
- **Skills** — `architecture-guardian` y `ub-mode`.
- **Verificación técnica** — Pasaron build, lint y formato. Las pruebas del cálculo cubrieron 162 combinaciones y límites del calendario local. Edge sin interfaz verificó acceso directo a Life, marcación y desmarcación, navegación, cambio de fecha, historial, aislamiento de cuentas e independencia de los pasos. La revisión visual corresponde al propietario.
- **Commit propuesto** — `feat(health): derive daily health status`.

#### 06B-RESET-01 · Inicio sin progreso simulado

- **Estado** — Completado, aprobado por el propietario.
- **Commit local verificado** — `773523b`.
- **Objetivo y alcance** — Conservar las seis tareas predeterminadas, iniciar sin completaciones ni registros de Health y retirar los valores de demostración de racha, antigüedad y fecha de alta.
- **Aceptación** — Today, Total y Streak comienzan en cero. Tareas y objetivos de Health comienzan desmarcados. La fecha visible usa `created_at` de Auth y, si falta, muestra la fecha local como simulada. Days in the ladder muestra un guion hasta 06B-07. La regla B y las interacciones siguen funcionando.
- **Skills** — `architecture-guardian` y `ub-mode`.
- **Verificación técnica** — En Edge sin interfaz se comprobaron inicio vacío, tareas predeterminadas, contadores al marcar y desmarcar, cambio de día, fecha real y simulada, cambio de cuenta y regla B. La revisión visual corresponde al propietario.
- **Commit propuesto** — `fix(previews): remove simulated progress records`.

#### 06B-07 · Racha y días desde el alta (P1)

- **Estado** — Completado, aprobado por el propietario.
- **Commit local verificado** — `708511f`.
- **Objetivo y alcance** — Derivar la racha original de Life y la antigüedad de Life, Activities y Learning. Reutilizar las completaciones, la regla B vigente en 06B y la fecha de registro disponible en Auth. 07-10A actualiza la racha de §02.8.
- **Aceptación** — La racha excluye hoy y respeta los incrementos, descansos y reinicios. El historial incluye tareas archivadas. La antigüedad cuenta días calendario locales e incluye el alta. Cuando falta el alta real, la fecha simulada queda identificada y es estable durante la sesión.
- **Skills** — `architecture-guardian` y `ub-mode`.
- **Verificación técnica** — Pasaron build, lint y formato. Se comprobaron 12 escenarios de racha, seis casos de calendario y la regresión de contadores. Edge sin interfaz verificó inicio vacío, navegación, cambio de día, aislamiento entre cuentas y fecha simulada estable. La revisión visual corresponde al propietario.
- **Commit** — `feat(progress): implement streak and days in ladder calculations`.

#### AUD-02-01 · Sincronización de las acciones con el día local (P1)

- **Estado** — Completado, aprobado por el propietario.
- **Commit local verificado** — `2752f95`.
- **Objetivo y alcance** — Compartir la referencia de fecha del layout privado entre las vistas y las acciones diarias. Resolver cada pulsación con los registros del día vigente, incluso si el temporizador se retrasa.
- **Aceptación** — La primera pulsación después de medianoche funciona en ambas escaleras y en Health. Las acciones conservan el historial, los indicadores siguen las reglas del dossier y la fecha se actualiza al recuperar foco o visibilidad.
- **Skills** — `architecture-guardian` y `ub-mode`.
- **Verificación técnica** — Pasaron build, lint, formato y `git diff --check`. En Edge sin interfaz se reprodujo el fallo previo y se comprobó su corrección con reloj simulado. Pasaron los casos de medianoche, temporizador retrasado, foco, visibilidad, pulsaciones consecutivas, historial, indicadores y aislamiento. También se verificaron creación, renombrado, retiro y la frase provisional. Las pruebas aisladas cubrieron 162 combinaciones de Health y 4.096 secuencias de racha. La revisión visual corresponde al propietario.
- **Commit propuesto** — `fix(dates): synchronize daily actions with the displayed day`.

**Cierre histórico:** la regla B y la racha original se probaron por separado de los contadores. 07-10A define su comportamiento vigente.

### G. API third-party de frases (P0)

#### 06B-08 · Frase diaria externa con DummyJSON (P0)

- **Estado** — Completado, aprobado por el propietario.
- **Commit local verificado** — `16ad597`.
- **Objetivo y alcance** — Conectar Life a DummyJSON mediante `fetch()`, validar el resultado y gestionar la frase diaria en el estado compartido. Aplicar la prevención de repeticiones según el dossier §02.10.
- **Aceptación** — Revelación bajo demanda, conservación durante el día, carga, éxito, error, vacío y reintento. Máximo de cinco solicitudes por intento si se reciben duplicados. Descartar respuestas obsoletas al cambiar de día o cuenta. Historial provisional en memoria y proveedor documentado en README.
- **Skills** — `architecture-guardian`, `ub-mode` y `ciber-security`.
- **Verificación técnica** — Edge mostró una frase real desde un origen local con HTTP 200 y respuesta CORS. Pasaron las pruebas aisladas de errores, reintento, duplicados por identificador y texto, límite de cinco, ventana de calendario, cambios de fecha y cuenta, y regresión de pasos. Pasaron build, lint, formato y `git diff --check`. La aprobación visual corresponde al propietario.
- **Commit propuesto** — `feat(quotes): integrate external daily quotes API`.

**Cierre:** frase real visible en navegador y estados de fallo comprobados.

### Cierre de la fase 06

**06A y 06B cerradas por aprobación del propietario.** Frontend visual y funcional completado, incluido ADD-CARD-01, RESET-01 y 06B-08. El commit de cierre es `3358eec`. 06-CLOSE superó la prueba de humo y el propietario aprobó el cierre. AUD-02 está completada y AUD-02-01 está corregido.

Supabase Auth está implementado. Tareas, completaciones y Health funcionan en memoria. Contadores, rachas y antigüedad se derivan de los datos de la sesión. DummyJSON está integrado y verificado con solicitudes reales. La prevención de repeticiones abarca hoy y los seis días anteriores. La frase y su historial residen en memoria y se reinician al recargar, cerrar sesión o cambiar de cuenta. La implementación de persistencia y la decisión de Auth para Etapa 2 quedan suspendidas.

### Fase 07 — API Express, persistencia y entrega

La [arquitectura vigente](dossier.md#03--tecnologías-arquitectura-y-diseño) corresponde a Etapa 1. La propuesta de Etapa 2 registrada en `92643be` queda suspendida. Los IDs E1 y E2 remiten a [07-AUD](07-AUD-cumplimiento-academico.md), que preserva las exigencias de cada etapa.

Antes de implementar, confirmar el límite del commit con la fila del objetivo. Corregir problemas ordinarios dentro del alcance aprobado. Si aparece un hallazgo material independiente, registrar en esta fase una propuesta con ID, evidencia, dependencias y criterio de aceptación. Ajustar el orden cuando corresponda y solicitar decisión si cambia materialmente el alcance. Mantener abierto cualquier objetivo con evidencia esencial pendiente, aunque exista un checkpoint local coherente. Las operaciones Git se rigen por la sección 1 y `AGENTS.md`.

#### 07A. Consolidación y base cliente/servidor (P0)

| Objetivo y estado | Responsabilidad, propósito y dependencias | Alcance y exclusiones | Skills | Resultado verificable y aceptación | Commit propuesto |
|---|---|---|---|---|---|
| **07-ARQ · Completado localmente** | Arquitectura v2.3 y ruta de migración consolidadas en los documentos de ese hito. Usa la rúbrica, Around y el diagnóstico local 07-00. | Dossier, plan, AGENTS y fuentes de Architect. La reubicación y los cambios ejecutables tienen sus propios objetivos. | architect-mode (#Creator, #Dev y #Guardian), ub-mode, ciber-security | Fuentes y versión verificables, cambios SQL pendientes identificados, equivalencia de Architect, links y diff revisados. Paquete técnico aceptado por el propietario. | `docs(architecture): consolidate academic MVP and migration plan` · commit local verificado `e2e1dbe0b76cc3312148d73d81388cd7a010d31d` |
| **07-ROOT · Completado localmente** | Entrada por sesión en `/` con alias `/life` y layout común. Corrección autorizada de 07-10, independiente de persistencia y reubicación. | Enrutamiento y selector de Life. El diseño y la lógica de datos quedan fuera. | architect-mode (#Guardian), ub-mode | Aceptado por el propietario. Visita `/` sin sesión y con sesión restaurada. Verificar rutas privadas directas, selector, estado al cambiar de ruta y logout desde ambas entradas a Life. | `fix(routes): render Life at the authenticated home` · commit local verificado `6a3261466cbad557e880ee878d3128dbd8a740f9` |
| **07-REL · Completado localmente** | Frontend y configuración reubicados en `client/`. Workspace npm y lockfile en la raíz. Depende de 07-ARQ y 07-ROOT. | Entrada, fuentes, assets y configuración del cliente. La base Express corresponde a 07-EXP. | architect-mode (#Dev), ub-mode, ciber-security | Implementación y verificación técnica realizadas. Instalación limpia desde caché y comandos de raíz correctos. Edge a 320 px con Auth simulada y DummyJSON real HTTP 200. Publicación e integración pendientes. | `refactor(repo): relocate Vite frontend into client workspace` · commit local verificado `7e867523a9802f7a52ce60f1299c63ea6e27be98` |
| **07-EXP · Completado localmente** | Fundación Express TypeScript acorde a Around. Workspace `server/`, router `/api`, healthz, errores JSON, límite de entrada, scripts de raíz y proxy Vite. Depende de 07-REL. | Arranque, proxy y respuestas HTTP base. Auth y datos privados se incorporan en sus objetivos respectivos. | architect-mode (#Dev), ub-mode, ciber-security | Implementación y verificación técnica realizadas. Arranques combinado, independientes y compilado correctos. Healthz directo y por Vite. Verificados JSON 404, 400, 413, 415 y 500 genérico. Publicación e integración pendientes. | `feat(server): establish Express API and development entry point` · commit local verificado `e1aadfed7704a60faaffcd20c475c4054bb83358` |
| **07-00 · Completado sin commit propio** | Diagnóstico de las dos migraciones iniciales y de AUD-02-04, 05 y 07. | Registro histórico de solo lectura. | architecture-guardian, ub-mode, ciber-security | La consulta anterior del propietario devolvió cero tablas visibles en `public`. AUD-02-07 quedó registrado como «Contratos provisionales ante errores de persistencia». | — |
| **07-AUD · En revisión** | Cotejo de ambas rúbricas y preparación de la transición desde `92643be`. | Matrices, evidencia local, inventario y reordenamiento del plan. | architect-mode (#Guardian y #Creator), ub-mode, ciber-security | IDs de las dos rúbricas mapeados y riesgos de rechazo separados de puntos. Verificación técnica documentada. Aceptación y commit pendientes. | `docs(audit): align project with both academic stages` |

#### 07B. Propuesta de Etapa 2 suspendida

Los objetivos siguientes se conservan como antecedente de la propuesta MongoDB y Auth propia. Sus fichas y commits propuestos son históricos y no habilitan ejecución. La tutoría del 26/11/2026 y la decisión posterior de la propietaria determinan si se retoman, se reformulan o se descartan.

<details>
<summary>Objetivos suspendidos de conexión, autenticación y persistencia</summary>


| Objetivo y estado | Responsabilidad, propósito y dependencias | Alcance y exclusiones | Skills | Resultado verificable y aceptación | Commit propuesto |
|---|---|---|---|---|---|
| **07-01 · Suspendido** | Conectar Express a Atlas. Depende de 07-EXP y del acceso de prueba autorizado. | Mongoose con `maxPoolSize`, arranque independiente de salud pública, `MONGODB_URI`, `PORT` y ejemplo saneado. Los modelos se incorporan por recurso. | ub-mode, ciber-security | Probar arranque, `/api/healthz` directo y por proxy, URI ausente o inválida y diagnóstico sin secretos. Modelar inicio y pérdida de BD sin acoplar la respuesta de salud al driver. Confirmar soporte de transacciones y comprobar el arranque exacto. E2-D02, C02–C03, C23 y M04–M05. | `feat(db): connect Express to MongoDB Atlas` |
| **07-REG · Suspendido** | Registrar cuentas con bcrypt. Depende de 07-01. | Modelo User, índice único, validación, hash, router de Auth, limitador de registro y `POST /api/signup`. | ub-mode, ciber-security | Validar campos antes de la BD y longitud mínima, incluidos 72 bytes UTF-8. Dos altas simultáneas del mismo correo normalizado crean una cuenta. Sin credenciales en respuesta y logs. Verificar 400, 409 y 429. E2-D03, C04–C07, C11–C14 y M01, M08–M09. | `feat(auth): register users with bcrypt` |
| **07-LOGIN · Suspendido** | Verificar credenciales y emitir JWT. Depende de 07-REG. | `POST /api/signin`, comparación bcrypt, firma con `JWT_SECRET` privado y limitador de inicio de sesión. | ub-mode, ciber-security | Credenciales correctas emiten JWT con identidad y expiración. Credenciales incorrectas devuelven un 401 genérico. Verificar 429 al exceder intentos y error operativo saneado. E2-D03, C03, C06–C07, C12–C14 y M02, M09. | `feat(auth): issue expiring JWTs at sign-in` |
| **07-AUTH · Suspendido** | Verificar el JWT y exponer la cuenta propia. Depende de 07-LOGIN. | Middleware Bearer, contexto tipado y `GET /api/users/me`. Aplicar el middleware a cada nuevo router privado. Salud conserva su acceso público. | ub-mode, ciber-security | JWT ausente, expirado, de firma inválida o con identidad mal formada devuelve 401. Dos usuarios reciben solo su propia cuenta; rechazar el token de una cuenta inexistente. E2-C06, C08–C09, C11, M02 y M08. | `feat(auth): protect requests and expose the current user` |
| **07-AUTH-UI · Suspendido** | Conectar la sesión React a Express. Depende de 07-AUTH. | Fetch tipado con `VITE_API_URL`, lectura de Bearer por petición, un único contexto existente compatible con `CurrentUserContext.Provider`, guardas y retiro del SDK y configuración Supabase del cliente. Resolver `localStorage` según 07-AUD y actualizar instrucciones de arranque. Conservar formularios, rutas y estilos. El corte para usuarios existentes se trata en §03 del dossier. | ub-mode, ciber-security | Probar alta, login, logout, recarga, expiración, reintento, redirecciones y respuestas tardías tras cambiar de cuenta. Verificar ausencia del SDK en el cliente y de secretos en el bundle. E2-C15–C21, M10–M11 y R01. | `feat(client): connect React to custom authentication` |

#### 07C. Datos persistidos y API (P0/P1)

| Objetivo y estado | Responsabilidad, propósito y dependencias | Alcance y exclusiones | Skills | Resultado verificable y aceptación | Commit propuesto |
|---|---|---|---|---|---|
| **07-03 · Suspendido** | Inicializar tareas una sola vez. Depende de 07-AUTH y 07-01. | Modelo Task e inicialización mediante `POST /api/account/bootstrap`, con indicador y siembra atómicos según dossier §§02.9 y 03. | ub-mode, ciber-security | Dos inicializaciones concurrentes crean tres tareas por escalera una sola vez. Un fallo revierte la siembra. Reingresar tras archivar no repone tareas. E2-C04, C09 y C12. | `feat(tasks): initialize account tasks once` |
| **07-04 / 07-05 · Suspendido** | Leer tareas propias y crear nuevas con límite concurrente. Depende de 07-03. | `GET /api/tasks` con activas y archivadas, y `POST /api/tasks`. Router propio. 07-06 incorpora las completaciones a la respuesta. | ub-mode, ciber-security | Lectura aislada por cuenta, estructura válida si está vacía, alta con ID y título normalizado. Una llamada de alta antes de la siembra se rechaza. Dos altas cerca del máximo dejan hasta cuatro activas. E2-C08–C12 y M08. | `feat(tasks): read and create owned tasks` |
| **07-05A / 07-06 · Suspendido** | Persistir marcas y mutaciones de tareas que dependen de ellas. Depende de 07-04 / 07-05. | Modelo e índice de completaciones, lectura coherente con tareas, fecha autorizada reutilizable, marcar/desmarcar, renombrar y DELETE archivado. Resolver aceptación de archivo y 403 con 07-AUD. Un commit comparte la garantía transaccional. | ub-mode, ciber-security | Marca repetida cuenta una vez. Rechazar tarea ajena, archivada o fecha cerrada. Renombrado efectivo o retiro limpian solo hoy, de forma indivisible. Renombrado equivalente conserva la marca. Verificar última activa, histórico y carreras marca/archivo y marca/renombrado. E2-C08–C10 y C12–C14. | `feat(tasks): persist daily marks and atomic task changes` |
| **07-07 · Suspendido** | Persistir la lectura y escritura diaria de Health. Depende de 07-AUTH y de la validación fechada de 07-06. | Router, modelo e índice cuenta/fecha, `GET /api/health` y actualización atómica de un objetivo, con fijación de zona cuando corresponda. | ub-mode, ciber-security | Dos cambios concurrentes preservan ambos objetivos. Una escritura explícita de `false` crea o conserva un registro con ceros. Un día sin interacción sigue sin registro. Verificar primera operación fechada, rechazo de un día cerrado y aislamiento. E2-C04, C09, C11–C12 y M08. | `feat(health): persist independent daily goals` |
| **07-08 · Aplazado** | Persistencia de frases de DEC-07-03 después de la entrega. | DummyJSON y la ventana en memoria siguen en el MVP. | ub-mode, ciber-security | Post-MVP, una frase por cuenta y día con recuperación tras recarga y aislamiento. En el MVP se verifica §02.10. | `feat(quotes): persist daily quote history per account` |

</details>

#### 07D. Integración, QA y entrega (P0)

Los objetivos de Etapa 2 marcados como suspendidos conservan el alcance anterior como referencia para reevaluación tras la tutoría.

| Objetivo y estado | Responsabilidad, propósito y dependencias | Alcance y exclusiones | Skills | Resultado verificable y aceptación | Commit propuesto |
|---|---|---|---|---|---|
| **07-09A · Suspendido** | Hidratar y conectar tareas y completaciones en React. Depende de 07-AUTH-UI y de las APIs de 07-03 a 07-06. | Reusar cliente Fetch, estado compartido y funciones de cálculo. Health continúa en memoria hasta 07-09B. | ub-mode, ciber-security | Acceso directo, cambios tras recarga, carga, vacío, error, reintento, cambio de cuenta, borradores y totales de lunes a martes. Feedback de alta y archivo. E2-C21–C22, M10–M11 y R01. | `feat(client): integrate persistent tasks and completions` |
| **07-09B · Suspendido** | Conectar Health al estado React y validar su efecto en Life. Depende de 07-07 y 07-09A. | Historial y acciones de Health. Reusar la presentación y los cálculos existentes. | ub-mode, ciber-security | Checks independientes tras recargar y en acceso directo. Health y Life comparten la progresión de 07-10A. Al recargar, conservar la diferencia entre día sin interacción y día registrado con ceros. Verificar racha de días cerrados y cero pasos de Health. Carga y feedback de checks. E2-M10–M11 y R01. | `feat(client): integrate persistent Health checks` |
| **07-09 · Suspendido** | QA funcional y de seguridad de Etapa 2. Depende de 07-09B. Absorbe la verificación de aislamiento de 07-02, que queda retirado como objetivo SQL. | Dos cuentas y datos de prueba en entorno autorizado. Reusar evidencia de los objetivos por recurso. | architect-mode (#Guardian), ub-mode, ciber-security | Verificar ingreso, protección, expiración, recarga y rechazo de lecturas, mutaciones y referencias ajenas. Verificar índices efectivos, siembra concurrente, límite, última activa, duplicados, archivo/marca, Health, cambio de zona y corte de día. Probar arranque, JWT, 400/401/403/404/409/429/500, excepciones saneadas y salud sin BD. Ejecutar comprobaciones de raíz, responsive y teclado. E2-D02–D03, D05, C06–C14, C16–C22, M05–M07, M10–M12 y R01–R02. | Sin commit si solo registra evidencia. |
| **07-10A · En revisión** | Cierre funcional y visual de Health para Etapa 1, antes de 07-10. | Cuatro niveles, herencia temporal y racha por días cerrados. Afinar leyenda y feedback con la sesión privada existente. | ub-mode, modern-web-guidance | Probar vacío inicial, descenso, interacción y desmarcado total, navegación y aislamiento. Confirmar reinicio por Health al cierre, contadores vigentes, contraste y estabilidad en 320 px, tablet y escritorio. Funcionalidad aceptada por la propietaria. Disposición móvil aprobada en alcance y verificada técnicamente. | Commits locales `4928eb3` y `62583da` |
| **07-PRES · En revisión** | Preparar la presentación de Etapa 1 y registrar la pausa de Etapa 2. | Verificar el árbol, limpiar directorios vacíos sin consumidores y alinear la documentación vigente. | architect-mode (#Dev y #Guardian), ub-mode | Supabase Auth y Express conservados. Referencias a la propuesta suspendida y a la rúbrica identificadas. | `chore(repo): clean up pending database migration preparations` |
| **07-10 · En revisión** | Cierre técnico y entrega independiente de Etapa 1. | [Matriz actualizada](07-AUD-cumplimiento-academico.md#cierre-técnico-07-10--candidata-62583da), README y candidata `62583da`. | architect-mode (#Guardian), ub-mode | Instalación limpia, arranque y frase real verificados. Pendientes la aceptación manual con acceso real de Supabase, la decisión de despliegue y la entrega del PR de Etapa 1. | `docs(academic): record stage one acceptance results` |
| **07-MIG · Suspendido** | Inventario de Supabase y decisión de corte. Puede empezar al disponer de acceso de solo lectura y bloquear solo la sustitución del servicio anterior. | Verificar cuentas, migraciones y conteos sin extraer secretos. Si existen cuentas o datos, proponer respaldo, verificación de identidad, reconciliación y corte reversible. | architect-mode (#Guardian), ciber-security | Evidencia saneada, decisión documentada y verificación de preservación antes del corte. Validar limpieza de variables anteriores después del corte autorizado. | Sin commit de inventario. Cualquier migración con código requiere alcance separado y evidencia que la justifique. |
| **07-11 · Suspendido** | Desplegar Etapa 2 con frontend, API HTTPS y Atlas. Depende de 07-09. El corte de un servicio anterior depende de 07-MIG. | Configuración de publicación, fallback SPA, `CLIENT_ORIGIN`, CORS y `trust proxy` ajustado a la plataforma. Conservar vías de acceso separadas y aceptar un mismo origen solo según la interpretación acordada. | ub-mode, ciber-security | Desde la URL real, verificar recarga de rutas, API JSON, login, restauración, aislamiento, persistencia y DummyJSON desde el navegador. Verificar límites con IP real y origen permitido/ajeno. E2-D04, C03, C24–C25, M03 y M06. | `build(deploy): configure the academic client and API deployment` |
| **07-12 · Suspendido** | Preparar README y entrega del PR de `stage-fullstack` a `main`. Depende de 07-11 y de la secuencia académica confirmada en 07-10. | README final versionado con ambos destinos públicos. Publicación y apertura del PR sujetas a autorización. | architect-mode (#Guardian), ub-mode | README con nombre, propósito, stack, instalación, variables sin valores sensibles, proveedor DummyJSON, URL pública del frontend y URL de la API. Entregar enlace al PR de Etapa 2 en su plazo. E2-D01, D05, C24 y R03. | `docs(readme): document setup and deployed ADHD Ladder` |

**Evidencia de 07-ROOT.** Edge con sesión y APIs simuladas verificó Landing y Life en `/` a 320 px, el selector, acceso directo, navegación con una tarea marcada y la frase revelada, error y reintento de logout y retorno a `/` desde ambas entradas a Life. QA con Auth real queda pendiente.

**Evidencia de 07-REL.** En Windows con Node.js 24.15.0 y npm 12.0.2, pasaron `npm install --offline --no-audit` con caché en un directorio limpio, `npm run dev`, `npm run build`, `npm run lint` y `npm run format:check`. El build coincide byte por byte con la salida anterior. Edge cargó Landing, About, formularios y las rutas privadas a 320 px con Auth simulada, CSS, favicon, imágenes y fuentes. Verificó el corte Today/Total, estado compartido de tareas y Health, salida de la sesión simulada y una frase real de DummyJSON conservada al navegar. Auth real queda pendiente para 07-09.

**Evidencia de 07-EXP.** Pasaron instalación raíz, build, lint y formato de ambos workspaces. El arranque combinado habilitó ambos servicios y la interrupción cerró sus puertos. Los comandos independientes verificaron el proxy con un puerto alternativo en `server/.env`. El arranque compilado respetó la prioridad de `PORT` y rechazó puertos inválidos u ocupados. La prueba HTTP verificó respuestas JSON 200, 404, 400, 413 y 415 directas y por Vite. Una excepción simulada en una app Express aislada verificó el 500 genérico del middleware compilado. Edge comprobó navegación y el proxy a 320 px con Auth y frase simuladas.

**Evidencia de 07-10A.** Pasaron build, lint y formato. Las pruebas aisladas cubrieron la progresión y 100.000 secuencias de racha. Edge con sesión y reloj simulados comprobó los cuatro colores, teclado, navegación Health–Life, cambio de fecha y cuenta, y racha de día abierto y cerrado. A 320, 768 y 1440 px la leyenda mantuvo sus dimensiones al cambiar de estado. El refinamiento móvil de `62583da` verificó el orden a 320, 375 y 425 px y la distribución a 768 y 1440 px.

**Evidencia de 07-PRES.** No se encontraron implementaciones, dependencias ni variables de entorno de la propuesta suspendida. Pasaron build, lint, formato y el arranque con Vite y Express. Edge verificó formularios y guardas con sesión simulada. Siete directorios vacíos de OneDrive quedaron fuera del cambio al bloquearse su eliminación.

**Camino crítico.** Presentar la candidata de Etapa 1 con la evidencia de 07-10 y confirmar acceso del evaluador, despliegue si aplica y entrega del PR. En la tutoría del 26/11/2026, aclarar si TripleTen admite Supabase PostgreSQL y Auth o requiere el stack literal de la rúbrica de Etapa 2. Registrar después la decisión de la propietaria antes de reactivar objetivos.

**Entrega en Git.** 07-10 sigue el PR de `stage-frontend → main`. La rúbrica conserva el PR separado de `stage-fullstack → main` para Etapa 2. La publicación, integración y apertura de ramas o PR requieren autorización.

**Antecedentes de datos.** Conservar las migraciones y el diagnóstico SQL, incluidos `5bbfa1c` y `59d87d7`. Cualquier transición de cuentas o datos queda condicionada a la decisión y al inventario autorizado de §03 del dossier.

### Mejoras posteriores al MVP

- **AUD-02-01** está resuelto y verificado en la fase 06.
- **03 y 12:** reapertura del popup por historial y foco de confirmación de contraseña. Mantener las comprobaciones de teclado y accesibilidad exigidas para la entrega.
- **09 y 10:** ampliar las reglas de exclusión para variantes de entorno y medir rendimiento antes de optimizar. La exclusión de secretos de la entrega sigue siendo obligatoria.
- **11:** la revisión de ARC-02 cotejó la referencia al retiro con el dossier §02.6. La skill queda como referencia de transición. El README final y la URL pública forman parte de 07-11 y 07-12.

## 4. Calendario objetivo y contingencias

| Fecha (2026) | Enfoque prioritario | Nota |
|---|---|---|
| Mié 25–Jue 26 | Preparar y presentar Etapa 1. Aclarar requisitos de Etapa 2 en tutoría | Priorizar el acceso del evaluador, la frase real y el PR de Etapa 1 |
| Vie 27–Dom 29 | Entregar Etapa 1 cuando cumpla sus requisitos | Registrar por separado lo que TripleTen confirme sobre arquitectura, entregas y revisión |
| Lun 30 | Fecha indicada de cierre del programa | Confirmar con TripleTen los plazos efectivos de entrega y revisión |

Etapa 2 permanece suspendida hasta la decisión de la propietaria tras la aclaración académica.

## 5. Qué recortar y qué no

- **Aplazado o recortable:** historial persistente de frases (07-08), animaciones, refinamientos estéticos, estadísticas avanzadas y otras mejoras P2. Mantener la UI 06A funcional ya realizada.
- **No recortable:** pasos diarios e históricos correctos, Auth, aislamiento por cuenta en la API, CRUD esencial sin pérdida histórica, API real de terceros con fetch, rutas obligatorias, build/lint, deploy, README y PR.
- Si hay un bloqueo de seguridad o de decisión de producto, informar la dependencia; preservar el histórico y la autorización de los recursos.

## 6. Flujo de trabajo y arranque de tarea

Seguir el flujo de aprobación de `AGENTS.md`. El plan registra el alcance, las dependencias y el estado de cada objetivo. El propietario realiza personalmente el commit tras validar el objetivo.

**Acuerdos de frontend para un objetivo posterior.** `TaskPages` sustituirá `LadderPage`. `TaskPages` y `TaskLadders` identificarán colectivamente Activities y Learning según corresponda. Conservar la lógica compartida y limitar la limpieza a carpetas vacías y código cuyo desuso se haya comprobado. La ejecución queda pendiente de autorización.

### DOC-01 · Actualización del flujo de desarrollo y revisión

- **Estado** — Completado, aprobado y commiteado por el propietario.
- **Objetivo y alcance** — Actualizar `AGENTS.md` con el orden de desarrollo, las responsabilidades de verificación, los niveles de análisis, el flujo Git y la separación del estado por dominio. Alinear las reglas de edición de tareas con el dossier vigente durante DOC-01.
- **Aceptación** — Diff documental limitado a `AGENTS.md`, con el flujo y las restricciones vigentes preservados. Se revisó el diff completo y pasó `git diff --check`.
- **Skills** — `architecture-guardian` y `ub-mode`.
- **Commit propuesto** — `docs(agents): update development and review workflow`.

### DOC-02 · Preparación de la fase 07

- **Estado** — Completado.
- **Commit local verificado** — `16af0b7`.
- **Objetivo y alcance** — Sincronizar `AGENTS.md` y el plan tras el cierre de fase 06 y especificar dependencias y aceptación de 07A y 07B.
- **Dependencias** — Cierre 06 y diagnóstico local 07-00 disponible para revisión.
- **Aceptación y verificación** — Historial preservado, decisiones abiertas visibles, hallazgos vinculados y `git diff --check` sin errores.
- **Validación manual** — Revisar el diff de ambos archivos y confirmar la correspondencia con el dossier y el alcance de 07.
- **Skills** — `architecture-guardian` y `ub-mode`.
- **Commit propuesto** — `docs(plan): prepare phase 07 persistence objectives`.

### DOC-03 · Contratos aprobados de persistencia

- **Estado** — Commit local `4aef247`. DEC-07-03 queda aplazado en 07-08. Los demás contratos documentados conservan su vigencia indicada en el dossier.
- **Alcance** — Formalizar DEC-07-01 a DEC-07-03 y registrar el cierre de 07-00. El diseño SQL se dejó fuera del plan de ejecución cuando se propuso MongoDB. 07-PRES mantiene abierta la decisión. La guía y las migraciones quedan como evidencia histórica.
- **Skills** — `architecture-guardian` y `ub-mode`.
- **Commit propuesto** — `docs(persistence): formalize approved persistence contracts`.

### ARC-01 · Instalación de Architect Mode v1.0

- **Estado** — En revisión. Estructura modular cotejada y skill visible por nombre y ruta en el catálogo de Codex de la sesión. La invocación explícita está disponible en esta revisión. Detección en una sesión nueva y selección automática por intención pendientes de comprobar.
- **Alcance y aceptación** — Skill local y cuatro referencias relativas resolubles, con modos de aplicación proporcional. La versión 1.0 está registrada en `4f34fd8`. La actualización a v1.2 corresponde a 07-ARQ.

### ARC-02 · Integración documental de Architect Mode

- **Estado** — En revisión del propietario.
- **Alcance y aceptación** — `AGENTS.md` coordina permisos, convenciones y selección. El dossier conserva las decisiones vigentes. Architecture Guardian permanece como referencia explícita para cotejo. Verificar la equivalencia entre las fuentes modulares y [el consolidado](Architect.md).
- **Skills** — `architect-mode` (#Dev y #Guardian), `architecture-guardian` para el cotejo, `ub-mode` y `ciber-security`.
- **Verificación técnica** — Coinciden el cuerpo, los metadatos y las cuatro referencias del consolidado con las fuentes modulares. Se comprobaron los destinos de los enlaces locales y el alcance del diff.
- **Commit propuesto** — `docs(agents): integrate Architect Mode and validate its workflow`, junto con ARC-03.

### ARC-03 · Validación del flujo resultante

- **Estado** — En revisión del propietario.
- **Dependencia** — ARC-02. Contrastar por simulación documental CSS, componente React, Supabase, reporte con defecto, revisión del brief, tutoría, operación Git/remota y solicitud fuera de alcance de una skill externa.
- **Aceptación** — Modos proporcionales, permisos explícitos, evidencia acorde al riesgo y revisión técnica a cargo del ejecutor. Verificar el diff, la equivalencia del consolidado y los límites de la simulación antes de recomendar el commit conjunto.
- **Verificación técnica** — Ocho escenarios revisados por simulación documental. Queda pendiente comprobar el flujo en una sesión nueva. La simulación no acredita ejecución de tareas, activación automática ni pruebas de PostgreSQL.
