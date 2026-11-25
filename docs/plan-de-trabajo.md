# ADHD Ladder — Plan de trabajo v2.2

> **Documento completo para reemplazar `docs/plan-de-trabajo.md`.** Actualizado el 24 de noviembre de 2026. Fuente normativa: `docs/dossier.md` v2.2. Este plan organiza el trabajo; **no sustituye las reglas del dossier ni acredita pruebas por sí mismo**.

**Producto:** ADHD Ladder · **Entrega:** TripleTen Etapa 1 · **Stack:** React + TypeScript + Vite + React Router + Supabase Auth/PostgreSQL/RLS + API de frases separada por `fetch()` · **Plazo:** 30/11/2026 · **Meta:** PR `stage-frontend` → `main` 28–29/11.

## 1. Reglas de trabajo y estado verificable

- Antes de ejecutar una etapa, inspeccionar el árbol **local actual**, `git status` y las secciones pertinentes del dossier. Seleccionar skills y modos según `AGENTS.md`. Los objetivos ya ejecutados conservan el registro de las skills usadas.
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
| 06B y API externa de frases | Cerradas y aprobadas. DummyJSON verificado en navegador local | Verificar desde el origen de producción |
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

- **Estado** — Completado, aprobado por el propietario.
- **Commit local verificado** — `5e3c814`.
- **Objetivo y alcance** — Centrar el botón de alta en su espacio y conservar su ancho y altura responsive base en el CSS compartido de Activities y Learning.
- **Aceptación** — De cero a tres tarjetas, el botón conserva sus dimensiones a cada ancho y queda centrado en ambos ejes. Con cuatro tarjetas se mantiene oculto. Las tarjetas y los popups conservan su geometría y comportamiento.
- **Skills** — `architecture-guardian` y `ub-mode`.
- **Verificación técnica** — Pasaron build, lint y formato. En Edge sin interfaz se comprobaron cero a cuatro tarjetas en ambas rutas a 320, 375, 640, 768, 1024, 1280 y 1440 px. Se verificaron dimensiones, centrado, ausencia de overflow horizontal, geometría de tarjetas y anclaje y cierre del popup con retorno de foco. La revisión visual corresponde al propietario.
- **Commit propuesto** — `fix(ladders): preserve add card button dimensions`.

### B. Decisiones aprobadas sobre el retiro de tareas

**Completado por decisión del propietario.** `Delete Card` archiva mediante `archived_at` y elimina solo la completación de hoy. La regla vigente y la conservación del histórico están en el dossier §02.6. El cierre de la decisión habilita 06B-05 en memoria. La revisión de RLS, claves foráneas e integridad en la base de datos corresponde a 07A.

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

### Fase 07 — Persistencia, seguridad y entrega

Solicitar aprobación antes de ejecutar migraciones, funciones SQL o cambios de esquema. Mantener cerradas las escrituras de clientes hasta verificar la integridad y el aislamiento de 07-02 en el entorno autorizado. Los commits indicados son propuestas.

#### 07A. Datos y seguridad Supabase (P0)

| ID y estado | Objetivo, alcance y dependencias | Skills | Aceptación y verificación técnica | Validación manual | Commit propuesto |
|---|---|---|---|---|---|
| **07-00 · Completado sin commit propio** | Diagnóstico de solo lectura de las dos migraciones y contraste de AUD-02-04, 05 y 07. | architecture-guardian, ub-mode, ciber-security | Revisión estática completada. AUD-02-07 consta en el informe de conversación como «Contratos provisionales ante errores de persistencia». | El propietario consultó `pg_tables` con `schemaname = 'public'` en Supabase SQL Editor. Resultado `Success. No rows returned` (cero filas). | — |
| **07-01 · En revisión** | Garantías SQL según DEC-07-01, DEC-07-02 y DEC-07-04 tras cerrar 07-00. Implementación inicial registrada y publicada en `5bbfa1c`. Correcciones registradas en `59d87d7`. | architecture-guardian, ub-mode, ciber-security | AUD-02-04, 05 y 06. Validación temporal, límites, unicidad y operaciones transaccionales. Revisión estática y casos actualizados en `supabase/tests/07-01-task-integrity.md`. Aplicación y verificación real pendientes de autorización. | Autorizar el entorno de pruebas y revisar el informe. El ejecutor verifica Health, zonas, permisos, historial, límites y reversión. | Propuesta histórica: `fix(db): align Health writes and time zone validation`. |
| **07-02 · Pendiente** | Políticas RLS (seguridad por fila) y permisos mínimos para el esquema y las operaciones de 07-01. | ub-mode, ciber-security | Con dos cuentas verificar lectura y escrituras autorizadas, referencias cruzadas rechazadas y escrituras directas restringidas. Comprobar acceso anónimo y que los permisos no permitan saltar 07-01. | Revisar la evidencia de aislamiento y permisos efectivos en el entorno autorizado. | `fix(db): enforce account isolation for persistent writes` |
| **07-03 · Pendiente** | Siembra inicial única de las seis tareas por cuenta. Depende de 07-01 y 07-02. Cubre la siembra de AUD-02-07. | ub-mode, ciber-security | Dos inicializaciones concurrentes producen tres tareas por escalera una sola vez. Reingreso y retiro previo no vuelven a sembrar. | Abrir una cuenta de prueba, recargar y confirmar que no aparecen duplicados. | `feat(data): seed default tasks once per account` |
| **07-04 · Pendiente** | Cargar tareas, completaciones, Health y perfil donde corresponda. Depende de 07-02 y 07-03. Reutilizar el estado compartido. | ub-mode, ciber-security | AUD-02-02 y 07. Verificar carga, vacío, error y reintento. Las respuestas de lectura o cierre tardías no afectan otra cuenta. El historial incluye tareas archivadas y los datos se adaptan a tipos e identificadores persistidos. | Recargar y alternar cuentas, comprobando que cada una muestra sus datos. | `feat(data): hydrate private session from Supabase` |
| **07-05 · Pendiente** | Conectar creación, renombrado y retiro a las operaciones de 07-01 y 07-02. Depende de 07-04. | ub-mode, ciber-security | Verificar §02.6, normalización, límites, conservación del histórico y borradores ante error (AUD-02-07). La aplicación refleja el resultado confirmado. | Crear, renombrar y retirar una tarjeta de prueba y comprobar el resultado tras recargar. | `feat(tasks): persist task creation rename and retirement` |
| **07-06 · Pendiente** | Conectar completaciones por tarea y día local. Depende de 07-01, 07-02 y 07-04. | ub-mode, ciber-security | Marcar, desmarcar y reintentar sin duplicar ni alterar días cerrados. Comprobar cambio de día, fallo de red, respuestas tardías y totales derivados. | Marcar y desmarcar en cada escalera y comprobar Today y Total tras recargar. | `feat(tasks): persist daily task completions` |
| **07-07 · Pendiente** | Persistir Health y verificar racha y antigüedad derivadas. Depende de 07-04 y 07-06 y de las garantías de fecha y acceso. | ub-mode, ciber-security | Los cambios independientes de objetivos no se sobrescriben. Verificar regla B, preservación de días cerrados, racha y antigüedad sin acumuladores. Health aporta cero pasos. | Marcar objetivos en Health y cotejar Life y la recarga. | `feat(health): persist daily health goals` |
| **07-08 · Pendiente de implementación** | Persistir frase diaria e historial por cuenta según DEC-07-03. Depende de 07-01, 07-02 y 07-04 y de la autorización de los cambios de esquema. | ub-mode, ciber-security | Una asignación por cuenta y fecha incluso bajo concurrencia. Verificar recuperación, aislamiento, retención completa, ventana de comparación de siete días, estados de petición y límite de cinco solicitudes a DummyJSON. | Revelar, recargar, volver a iniciar sesión y acceder desde otro dispositivo. Verificar que se conserva la frase y que otra cuenta permanece aislada. | `feat(quotes): persist daily quote history per account` |
| **07-09 · Pendiente** | Cierre funcional y de seguridad tras 07-02 a 07-08. | architect-mode (#Guardian), ciber-security | Verificar con dos cuentas navegación, recarga, errores de red, historial, fechas y aislamiento. Comprobar alta, restauración y cierre con Auth real y revisar mensajes de confirmación y privacidad según la configuración (AUD-02-08). | Revisar el informe y repetir los escenarios de aceptación acordados. | — |

**Evidencia de cierre de 07-00.** En esa comprobación, la consulta de solo lectura del propietario no mostró tablas visibles en `public`. El estado actual y el historial de aplicación deben confirmarse en el entorno de pruebas antes de ejecutar la cadena. La consulta no informa sobre los usuarios de Supabase Auth. RLS efectivo, atomicidad, concurrencia y aislamiento siguen pendientes de verificación. En 07-00 no se ejecutaron migraciones ni operaciones destructivas.

**Correcciones de 07-01 pendientes de aplicar y verificar.** Health devuelve un nulo SQL sin crear fila si se solicita `false` y aún falta la fila diaria, según el dossier §02.7. La validación de zona usa la coincidencia exacta en el catálogo de PostgreSQL y convierte las fechas con la zona nombrada, según §02.4. Queda por comprobar la compatibilidad con los navegadores objetivo y la representación del retorno por la API de Supabase. Se conserva la versión de la tercera migración al no haber evidencia de aplicación. Si el historial del entorno muestra que ya se aplicó, los ajustes requieren una migración correctiva.

#### 07B. QA, despliegue y entrega (P0)

| ID y estado | Objetivo, alcance y dependencias | Skills | Aceptación y verificación técnica | Validación manual | Commit propuesto |
|---|---|---|---|---|---|
| **07-10 · Pendiente** | Verificación local de entrega tras 07-09. | architect-mode (#Guardian), ub-mode | Desarrollo, compilación, lint, formato y diff verificados. Rutas, formularios, teclado, foco y diseño adaptable desde 320 px. | Revisar los flujos representativos y la presentación. | — |
| **07-11 · Pendiente** | Despliegue y README definitivo tras 07-10, con autorización de publicación. | ub-mode, ciber-security | Abrir y recargar rutas internas sin 404. Comprobar Auth y RLS con dos cuentas en el despliegue y DummyJSON desde el origen real. README con propósito, stack, instalación, variables públicas, proveedor y URL desplegada. | Abrir el enlace público, recargar Life y revelar una frase. | `docs(readme): document deployed application and setup` |
| **07-12 · Pendiente** | Entrega tras 07-11 y con autorización para publicar y abrir la solicitud. | architect-mode (#Guardian) | Revisar el diff final, abrir PR (solicitud de integración) de `stage-frontend` a `main` y compartir la URL del PR. | Revisar el PR y confirmar la entrega. | — |

**Cierre de entrega** — Meta de despliegue y PR el 28–29 de noviembre de 2026. Plazo oficial el 30 de noviembre.

### Mejoras posteriores al MVP

- **AUD-02-01** está resuelto y verificado en la fase 06.
- **03 y 12:** reapertura del popup por historial y foco de confirmación de contraseña. Mantener las comprobaciones de teclado y accesibilidad exigidas para la entrega.
- **09 y 10:** ampliar las reglas de exclusión para variantes de entorno y medir rendimiento antes de optimizar. La exclusión de secretos de la entrega sigue siendo obligatoria.
- **11:** la revisión de ARC-02 cotejó la referencia al retiro con el dossier §02.6. La skill queda como referencia de transición. El README final y la URL pública forman parte de 07B.

## 4. Calendario objetivo y contingencias

| Fecha (2026) | Enfoque prioritario | Nota |
|---|---|---|
| Mar 24 | Cierre 06 y DOC-02. Revisar el diagnóstico 07-00 | Confirmar fecha local, autorizaciones y dependencias |
| Mié 25 | Integridad, atomicidad, límites, permisos, aislamiento y siembra | Validar garantías antes de habilitar escrituras |
| Jue 26 | Lectura y escrituras de tareas, completaciones y Health | Verificar historial, cuentas y valores derivados |
| Vie 27 | Historial de frases según decisión, cierre de persistencia y verificación de entrega | Completar comprobaciones obligatorias y preparar README |
| Sáb 28 | QA, deploy, revisión en producción y PR | Meta principal de entrega |
| Dom 29 | Correcciones y envío del PR si aún falta | Evitar funciones nuevas |
| Lun 30 | Margen de evaluación | No dejar entregables obligatorios pendientes |

El calendario es una guía, **no una declaración de trabajo completado**, y debe adaptarse a evidencia local. La disponibilidad de horas original era aproximada (3 h días laborales; 7 h miércoles y sábado), no una garantía.

## 5. Qué recortar y qué no

- **Recortable:** animaciones, refinamientos estéticos, estadísticas avanzadas y otras mejoras P2. Mantener la UI 06A funcional ya realizada, pero no ampliarla sin necesidad.
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

- **Estado** — En revisión del propietario.
- **Alcance** — Formalizar DEC-07-01 a DEC-07-03 y registrar el cierre de 07-00. El diseño SQL corresponde a 07-01.
- **Skills** — `architecture-guardian` y `ub-mode`.
- **Commit propuesto** — `docs(persistence): formalize approved persistence contracts`.

### ARC-01 · Instalación de Architect Mode v1.0

- **Estado** — En revisión. Estructura modular cotejada y skill visible por nombre y ruta en el catálogo de Codex de la sesión. La invocación explícita está disponible en esta revisión. Detección en una sesión nueva y selección automática por intención pendientes de comprobar.
- **Alcance y aceptación** — Skill local y cuatro referencias relativas resolubles, con modos de aplicación proporcional. El paquete sigue sin seguimiento en Git hasta el commit del propietario.

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
