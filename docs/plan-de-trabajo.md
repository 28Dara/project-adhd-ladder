# ADHD Ladder — Plan de trabajo v2.4

> **Actualizado el 25 de noviembre de 2026.** [Dossier v2.3](dossier.md) como fuente normativa. El plan organiza entregables, dependencias y evidencia de ejecución.

**Producto:** ADHD Ladder · **Entrega:** TripleTen Etapa 1 · **Stack:** React, TypeScript, Vite, React Router, Node.js, Express, Supabase Auth/PostgreSQL con RLS y DummyJSON con Fetch nativo · **Plazo:** 30/11/2026 · **Meta:** PR `stage-frontend` → `main` 28–29/11.

## 1. Reglas de trabajo y estado verificable

- Antes de ejecutar una etapa, inspeccionar el árbol **local actual**, `git status` y las secciones pertinentes del dossier. Seleccionar skills y modos según `AGENTS.md`. Los objetivos ya ejecutados conservan el registro de las skills usadas.
- Los reportes de Codex sobre 06A son indicios de trabajo realizado, **no evidencia independiente de pruebas**. No marcar una etapa como completa hasta verificar el código y su resultado.
- No crear ramas, hacer commit, push, merge, ejecutar migraciones o eliminar datos sin autorización explícita.
- Prioridad de decisiones: instrucción más reciente del propietario > `[DECIDIDO]` del dossier vigente > este plan > propuestas `[PROP]`. Solicitar decisión sobre los puntos `[ABIERTO]`.
- Mantener cambios pequeños, revisables y con verificación; no sacrificar funcionalidades obligatorias por pulido visual.

## 2. Línea base local al 25 de noviembre

| Área | Estado de trabajo conocido | Prueba/cierre requerido |
|---|---|---|
| Árbol local | `stage-frontend`, `4450a5b` al iniciar 07-ARQ. Cliente en la raíz. El PDF local de Etapa 1 estaba sin seguimiento. | Revisar reubicación después de 07-ARQ y 07-ROOT |
| Setup, rutas y maquetación Etapa 05 | Realizada/revisada en fase 06 según reportes previos | Build, lint y prueba visual final de las cuatro escaleras |
| Auth y rutas privadas | `AuthProvider` y layout por cuenta ya implementados. Ajuste de `/` en 07-ROOT. | Verificar registro, login, logout, restauración y redirects con cuenta real |
| 06A popups | Edición temporal, tooltips, menús, Health clicable y quote local | Comprobaciones funcionales en QA |
| 06A.1 visual | Páginas actuales aprobadas visualmente por el propietario | Cerrado por el propietario |
| Supabase, SQL y RLS | Tres archivos de migración y guía histórica de verificación. Cloud pendiente de inventario. | Conciliar historial, preparar SQL mínimo y verificar con dos cuentas |
| CRUD de tareas y checks persistidos | Implementados en memoria. API Express pendiente. | Crear, renombrar, retirar, marcar y desmarcar con persistencia |
| Contadores v2.2 | 06B-03 aprobado y commiteado por el propietario | QA con persistencia cuando corresponda |
| 06B y API externa de frases | Cerradas y aprobadas. DummyJSON verificado en navegador local | Verificar desde el origen de producción |
| Deploy / README / PR | Pendientes | URL pública, sin 404 al recargar, README y PR a tiempo |

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

**Completado por decisión del propietario.** `Delete Card` archiva mediante `archived_at` y elimina solo la completación de hoy. La regla vigente y la conservación del histórico están en el dossier §02.6. El cierre de la decisión habilitó 06B-05 en memoria. La revisión de RLS, claves foráneas e integridad en la base de datos corresponde a 07-01 y 07-02.

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
- **Objetivo y alcance** — Derivar la racha de Life y la antigüedad de Life, Activities y Learning según el dossier §02.8. Reutilizar las completaciones, la regla B y la fecha de registro disponible en Auth.
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

**Cierre:** reglas Health B y racha probadas de forma independiente de contadores históricos.

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

Supabase Auth está implementado. Tareas, completaciones y Health funcionan en memoria. Contadores, rachas y antigüedad se derivan de los datos de la sesión. DummyJSON está integrado y verificado con solicitudes reales. La prevención de repeticiones abarca hoy y los seis días anteriores. La frase y su historial residen en memoria y se reinician al recargar, cerrar sesión o cambiar de cuenta. La persistencia real y la verificación de RLS siguen pendientes.

### Fase 07 — API Express, persistencia y entrega

La arquitectura de [dossier §03](dossier.md#03--tecnologías-arquitectura-y-diseño) está decidida. El diseño de migración y sus cambios de contrato siguen pendientes de aceptación. Los IDs existentes conservan su dominio. Cada objetivo de implementación define el alcance de un commit y la evidencia para cerrarlo. Las revisiones y pasos de entrega registran la evidencia que les corresponde en el mismo plan.

Antes de implementar, confirmar el límite del commit con la fila del objetivo. Corregir problemas ordinarios dentro del alcance aprobado. Si aparece un hallazgo material independiente, registrar en esta fase una propuesta con ID, evidencia, dependencias y criterio de aceptación. Ajustar el orden cuando corresponda y solicitar decisión si cambia materialmente el alcance. Mantener abierto cualquier objetivo con evidencia esencial pendiente, aunque exista un checkpoint local coherente. Las operaciones Git se rigen por la sección 1 y `AGENTS.md`.

#### 07A. Consolidación y base cliente/servidor (P0)

| Objetivo y estado | Responsabilidad, propósito y dependencias | Alcance y exclusiones | Skills | Resultado verificable y aceptación | Commit propuesto |
|---|---|---|---|---|---|
| **07-ARQ · En revisión** | Arquitectura y ruta de migración consolidadas en los documentos vigentes. Usa la rúbrica, Around y el diagnóstico local 07-00. | Dossier, plan, AGENTS y fuentes de Architect. La reubicación y los cambios ejecutables tienen sus propios objetivos. | architect-mode (#Creator, #Dev y #Guardian), ub-mode, ciber-security | Fuentes y versión verificables, cambios SQL pendientes identificados, equivalencia de Architect, links y diff revisados. El propietario decide el paquete técnico como un todo. | `docs(architecture): consolidate academic MVP and migration plan` |
| **07-ROOT · En revisión** | Entrada por sesión en `/` con alias `/life` y layout común. Corrección autorizada de 07-10, independiente de persistencia y reubicación. | Enrutamiento y selector de Life. El diseño y la lógica de datos quedan fuera. | architect-mode (#Guardian), ub-mode | Visita `/` sin sesión y con sesión restaurada. Verificar rutas privadas directas, selector, estado al cambiar de ruta y logout desde ambas entradas a Life. | `fix(routes): render Life at the authenticated home` |
| **07-REL · Pendiente** | Reubicar frontend y su configuración en `client/`. Incorporar el workspace npm de raíz y mantener los comandos de evaluación. Depende de 07-ARQ y revisión de 07-ROOT. | Mover entrada, fuentes, assets y configuración del cliente. La base Express corresponde a 07-EXP. | architect-mode (#Dev), ub-mode | Instalación raíz, `npm run dev`, build, lint y formato correctos. Entrada HTML, assets, Vite, TypeScript, variables y rutas intactos. | `refactor(repo): relocate Vite frontend into client workspace` |
| **07-EXP · Pendiente** | Fundación Express TypeScript acorde a Around. Crear `server/`, montaje `/api`, healthz, errores JSON, límites de entrada, scripts de raíz y proxy Vite. Depende de 07-REL. | Arranque, proxy y respuestas HTTP base. Auth y datos privados se incorporan en sus objetivos respectivos. | architect-mode (#Dev), ub-mode, ciber-security | Levantar ambos procesos con `npm run dev`; healthz verificable desde Vite, 404 de API en JSON y compilación/lint de los dos paquetes. | `feat(server): establish Express API and development entry point` |
| **07-AUTH · Pendiente** | Middleware Bearer con Supabase Auth y SDK de datos de alcance por petición. Depende de 07-EXP. | Validación del token y contexto por petición. Los permisos persistentes corresponden a 07-02. | ub-mode, ciber-security | Petición sin token o inválida recibe 401; una sesión válida produce su propia identidad; fallos operativos se distinguen de credenciales inválidas. Dos peticiones simultáneas conservan identidades separadas. | `feat(server): authenticate requests with Supabase Auth` |

#### 07B. Datos persistidos y API (P0 y P1)

| Objetivo y estado | Responsabilidad, propósito y dependencias | Alcance y exclusiones | Skills | Resultado verificable y aceptación | Commit propuesto |
|---|---|---|---|---|---|
| **07-00 · Completado sin commit propio** | Diagnóstico de las dos migraciones iniciales y de AUD-02-04, 05 y 07. | Registro histórico de solo lectura. | architecture-guardian, ub-mode, ciber-security | Revisión estática. La consulta de solo lectura del propietario devolvió cero filas para tablas de `public` en esa comprobación. AUD-02-07 quedó registrado como «Contratos provisionales ante errores de persistencia». | — |
| **07-01 · Bloqueado para ejecución Cloud** | Aprobar el SQL mínimo y los ajustes de contrato de dossier §03. Conciliar la cadena con el entorno, preparar tablas, restricciones y soporte de transacciones. Depende de 07-ARQ y del inventario de Cloud. SQL anterior en `5bbfa1c` y `59d87d7`. | Esquema, restricciones y soporte transaccional. Mantener cerradas las escrituras y obtener autorización separada para aplicar SQL. | ub-mode, ciber-security | Cotejar historial, schema, claves, datos existentes y zona de escritura. Preparar migración inicial o correctiva según evidencia. Aplicar únicamente con autorización y con escrituras cerradas. [Procedimiento histórico](../supabase/tests/07-01-task-integrity.md). | `feat(db): align the persistent schema with Express` |
| **07-02 · Pendiente** | RLS, grants mínimos y controles efectivos de 07-01. Verificar aislamiento antes de exponer los puntos de escritura. Depende de 07-01 y de autorización de prueba. | Políticas y permisos efectivos de la base. Las RPC de cada recurso y sus concesiones se verifican en sus respectivos objetivos. | ub-mode, ciber-security | Con dos cuentas, lecturas propias y referencias compuestas verificadas. Anónimo sin acceso personal y DML directo cerrado. Verificar permisos de cada RPC al incorporarla en 07-03, 07-05, 07-05A, 07-06 y 07-07. | `fix(db): enforce account isolation and restricted writes` |
| **07-03 · Pendiente** | Inicialización atómica en `POST /api/account/bootstrap`. Depende de 07-AUTH y 07-02. | Inicializar el perfil y sus seis tareas en una transacción. Mantener fuera los endpoints ordinarios de tareas. | ub-mode, ciber-security | Dos inicializaciones concurrentes crean tres tareas por escalera una sola vez. Reingreso y archivo anterior no resiembran. Devuelve zona y fecha de alta verificables. | `feat(accounts): initialize account data once` |
| **07-04 · Pendiente** | Lecturas autenticadas de tareas y completaciones por cuenta en `GET /api/tasks`. Depende de 07-AUTH, 07-02 y 07-03. | Leer tareas y completaciones del propietario. Las mutaciones y la integración React tienen objetivos propios. | ub-mode, ciber-security | Respuestas tipadas con carga útil válida, incluida lista vacía. Archivadas disponibles para contar el histórico. La consulta paginada conserva todos los registros pertinentes. | `feat(tasks): expose owned tasks and completion history` |
| **07-05 · Pendiente** | Dar de alta tareas desde Express con nombre validado y capacidad respetada. Depende de 07-04. | Alta de tareas y garantía concurrente de capacidad. Renombrado y retiro corresponden a 07-05A. | ub-mode, ciber-security | Crear una tarea activa con ID y título normalizado. Dos altas concurrentes cerca del máximo mantienen hasta cuatro activas. | `feat(tasks): persist task creation` |
| **07-05A · Pendiente** | Renombrar o retirar una tarea sin perder sus pasos históricos. Depende de 07-05. | Renombrado y archivo con la eliminación atómica de la completación de hoy. La marcación diaria corresponde a 07-06. | ub-mode, ciber-security | Renombre efectivo o retiro limpian solo la marca de hoy en la misma transacción. Un renombre equivalente conserva la marca. La última tarea activa permanece protegida y el ID no cambia. | `feat(tasks): persist atomic rename and archival` |
| **07-06 · Pendiente** | Completación diaria en Express con estado deseado e idempotencia. Depende de 07-05A. | Cambiar el estado deseado para un día autorizado. La integración React corresponde a 07-09A. | ub-mode, ciber-security | Marcar y desmarcar afectan solo la fecha admitida. Duplicados concurrentes cuentan una vez, tarea ajena o archivada se rechaza y una fecha cerrada queda intacta. Verificar concurrencia de marcado con renombrado y retiro. | `feat(tasks): persist daily completion state` |
| **07-07 · Pendiente** | Lectura y escritura diaria de Health en Express. Depende de 07-02, 07-AUTH y 07-03. | Consultar historial de Health y modificar un objetivo diario por petición. La conexión de Health a React corresponde a 07-09B. | ub-mode, ciber-security | Actualizar un objetivo conserva los otros, incluso con dos escrituras concurrentes. Día sin fila con `false` devuelve `null`. Los checks cerrados permanecen. | `feat(health): persist independent daily goals` |
| **07-08 · Aplazado** | Persistencia de frases de DEC-07-03 fuera de la entrega. En el MVP sigue DummyJSON y la ventana en memoria de §02.10. | Objetivo posterior al MVP. DummyJSON conserva su comportamiento de sesión durante la entrega. | ub-mode, ciber-security | Post-MVP, una frase persistida por cuenta y día con recuperación tras recarga y aislamiento. La entrega verifica únicamente el comportamiento en sesión. | `feat(quotes): persist daily quote history per account` |

#### 07C. Integración, QA y entrega (P0)

| Objetivo y estado | Responsabilidad, propósito y dependencias | Alcance y exclusiones | Skills | Resultado verificable y aceptación | Commit propuesto |
|---|---|---|---|---|---|
| **07-09A · Pendiente** | Hidratar la cuenta y conectar las tareas y sus completaciones en el cliente. Depende de 07-03, 07-04, 07-05, 07-05A y 07-06. | Cliente HTTP y estado compartido de cuenta, tareas y completaciones. Mantener Health en memoria hasta 07-09B. | ub-mode, ciber-security | Las rutas privadas hidratan al abrirlas directamente. Altas, nombres, archivos y marcas persisten tras recargar. Verificar carga, vacío, error, reintento, cambio de cuenta, borradores y totales de lunes a martes. | `feat(client): integrate persistent tasks and completions` |
| **07-09B · Pendiente** | Conectar Health persistido en React y validar su efecto en Life. Depende de 07-07 y 07-09A. | Conectar historial y acciones de Health al estado existente. Conservar la lógica derivada y la presentación. | ub-mode, ciber-security | Checks independientes disponibles en acceso directo y tras recargar. Health y Life coinciden en regla B. Verificar racha con días cerrados y que Health aporta cero pasos. | `feat(client): integrate persistent Health checks` |
| **07-09 · Pendiente** | QA funcional y de seguridad representativo sobre el resultado integrado. Depende de 07-09B y permisos verificados de 07-02. | Ejecutar y registrar pruebas representativas. Tramitar hallazgos materiales mediante el flujo de ajuste del plan. | architect-mode (#Guardian), ub-mode, ciber-security | Con dos cuentas de prueba, verificar Auth real, API, aislamiento también vía Data API, FK cruzada, recarga y rechazo de datos ajenos. Verificar seed concurrente, marca duplicada, límite concurrente, carrera archivo/marca, objetivos Health independientes y corte de día, aprovechando la evidencia anterior. Registrar resultados y regresiones observadas. | Sin commit si solo registra evidencia en el informe. |
| **07-10 · En revisión** | Rúbrica oficial y correcciones acotadas, con cierre tras 07-09. | Cotejar la rúbrica y reunir evidencia académica. Las correcciones con diff tienen objetivo propio. | architect-mode (#Guardian), ub-mode | La revisión anterior registró instalación desde lock/caché, arranque, build, lint, formato, ocho rutas de 320 a 1440 px, foco y frase real HTTP 200. Usó sesión ficticia para rutas privadas. Verificar versión integrada, acceso del evaluador, lecciones 1.1/1.2 si disponibles y equivalencia de React Router v8. | Sin commit de revisión. 07-ROOT identifica el cambio de código actual. |
| **07-11 · Pendiente** | Desplegar cliente y servidor en un origen HTTPS autorizado, con SPA fallback, variables y redirect de Auth. Depende de 07-09 y preparación 07-10. | Configuración versionada y verificación de la publicación autorizada. El README y la entrega del PR corresponden a 07-12. | ub-mode, ciber-security | La configuración local puede servir como checkpoint. Desde la URL real, recargar rutas públicas y privadas, comprobar API JSON, Auth, dos cuentas y una frase real de DummyJSON desde el navegador. | `build(deploy): configure the academic client and API deployment` |
| **07-12 · Pendiente** | Preparar la entrega reproducible con README y PR final de `stage-frontend` a `main`. Depende de 07-11 y aceptación de 07-10. | El commit cubre el README de entrega. Publicar y abrir el PR son pasos de entrega sujetos a autorización. | architect-mode (#Guardian), ub-mode | README con nombre, propósito, tecnologías, instalación, variables públicas, proveedor DummyJSON y URL de la app. Revisar diff y entregar la URL del PR previa autorización de publicación. | `docs(readme): document setup and deployed ADHD Ladder` |

**Evidencia de 07-ROOT.** Edge con sesión y APIs simuladas verificó Landing y Life en `/` a 320 px, el selector, acceso directo, navegación con una tarea marcada y la frase revelada, error y reintento de logout y retorno a `/` desde ambas entradas a Life. Pendientes la aceptación del propietario y QA con Auth real.

**Camino crítico.** Revisar 07-10 pronto y avanzar 07-REL → 07-EXP → 07-AUTH mientras se obtiene la evidencia de Cloud. Cerrar 07-01 y 07-02 antes de conectar las escrituras. Hacer 07-03 a 07-07 por recurso, con 07-05A para las mutaciones que preservan el historial. Integrar tareas en 07-09A y Health en 07-09B. Reutilizar la evidencia de cada commit en 07-09. 07-08 queda fuera de esta dependencia. Confirmar acceso del evaluador y origen de alojamiento antes de la comprobación final.

**Cloud y antecedentes.** El informe 07-00 describe una comprobación anterior. El 25 de noviembre el diagnóstico de 07-01 descartó un entorno local utilizable y dejó las pruebas SQL pendientes. Consultar el inventario de solo lectura del dossier antes de ejecutar cambios y conservar la guía de 07-01 como evidencia histórica. Mantener implementación, validación, aceptación del propietario, commit, publicación e integración como estados distintos.

### Mejoras posteriores al MVP

- **AUD-02-01** está resuelto y verificado en la fase 06.
- **03 y 12:** reapertura del popup por historial y foco de confirmación de contraseña. Mantener las comprobaciones de teclado y accesibilidad exigidas para la entrega.
- **09 y 10:** ampliar las reglas de exclusión para variantes de entorno y medir rendimiento antes de optimizar. La exclusión de secretos de la entrega sigue siendo obligatoria.
- **11:** la revisión de ARC-02 cotejó la referencia al retiro con el dossier §02.6. La skill queda como referencia de transición. El README final y la URL pública forman parte de 07B.

## 4. Calendario objetivo y contingencias

| Fecha (2026) | Enfoque prioritario | Nota |
|---|---|---|
| Mié 25 | Consolidación de arquitectura y raíz. Iniciar evidencia de Cloud | Revisión del propietario y de la rúbrica |
| Jue 26 | Reubicación, base Express, Auth y contraste de permisos | Autorizar los cambios de persistencia por separado |
| Vie 27 | Persistencia e integración esencial, con prueba representativa por recurso | Priorizar el camino de datos completo y preparar la entrega |
| Sáb 28 | QA, deploy, revisión en producción y PR | Meta principal de entrega |
| Dom 29 | Correcciones y envío del PR si aún falta | Evitar funciones nuevas |
| Lun 30 | Margen de evaluación | No dejar entregables obligatorios pendientes |

El calendario es una meta. Inventario de Cloud, acceso de prueba, autorización de SQL y alojamiento deben resolverse pronto. La revisión del propietario y el alcance de la integración hacen ajustada la meta del 28–29. Si se desplaza el calendario, resolver con el propietario los conflictos de entrega preservando aislamiento e historial.

## 5. Qué recortar y qué no

- **Aplazado o recortable:** historial persistente de frases (07-08), animaciones, refinamientos estéticos, estadísticas avanzadas y otras mejoras P2. Mantener la UI 06A funcional ya realizada.
- **No recortable:** pasos diarios e históricos correctos, Auth, aislamiento RLS, CRUD esencial sin pérdida histórica, API real de terceros con fetch, rutas obligatorias, build/lint, deploy, README y PR.
- Si hay un bloqueo de seguridad o de decisión de producto, informar la dependencia; no resolverlo mediante borrado de historial ni dejando RLS desactivada.

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
- **Alcance** — Formalizar DEC-07-01 a DEC-07-03 y registrar el cierre de 07-00. El diseño SQL corresponde a 07-01.
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
