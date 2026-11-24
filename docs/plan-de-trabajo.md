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
| Contadores v2.2 | Nueva regla documental aprobada; no asumir código actualizado | Implementar y probar hoy vs días cerrados sin duplicados |
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

- **Estado** — En revisión del propietario.
- **Objetivo y alcance** — Reutilizar la apariencia compartida de `.ladder-check` en Health y conservar el área clicable y el foco visible.
- **Aceptación** — Casilla desmarcada vacía, casilla marcada verde con palomita y dimensiones y posición conservadas. Build, lint y formato pasan. La revisión visual corresponde al propietario.
- **Skills** — `architecture-guardian` y `ub-mode`.
- **Verificación técnica** — Build, lint y formato pasaron. En Edge sin interfaz se reprodujo la X anterior y se comprobaron los estilos de ambos estados, las dimensiones y la posición al marcar, el foco visible y el clic en la etiqueta.
- **Commit propuesto** — `fix(health): simplify checkbox visual states`.

### B. Cierre de la decisión abierta que bloquea CRUD destructivo

- [ ] Pedir decisión al propietario para el único caso pendiente: **una tarea completada hoy que se elimina/retira hoy**. Debe definirse si la completación de hoy sobrevive y cuenta mañana o se revierte hoy.
- [ ] No permitir hard-delete con pérdida de pasos históricos. Confirmar si la opción UI `Delete Card` sigue siendo un retiro/archivo interno mediante `archived_at` u otra estrategia explícitamente aprobada.
- [ ] Revisar impacto en completaciones de hoy, RLS, FK, histórico y racha antes de cambiar la implementación.

**Cierre:** regla escrita en dossier y prueba esperada definida **antes** de implementar eliminación persistente. El resto del CRUD no destructivo puede avanzar en tareas separadas.

### C. Datos y seguridad Supabase (P0)

- [ ] Revisar migraciones existentes contra dossier v2.2, especialmente `tasks`, `task_completions`, `health_checks`, unicidad `(task_id, completed_date)`, FK compuesta y **ausencia de cascada destructiva de historial**.
- [ ] Revisar políticas RLS de SELECT, INSERT, UPDATE, DELETE por propietario en cada tabla personal, incluyendo referencias cruzadas.
- [ ] Aplicar migraciones **solo después de autorización**, comprobar esquema real, probar aislamiento con dos cuentas y errores de red.
- [ ] Definir/verificar siembra de las seis tareas de ejemplo **una sola vez** para cada cuenta. No resembrar si el usuario retira tareas.

**Cierre:** persistencia real y RLS comprobadas en dos cuentas, sin pérdida de historial.

### D. 06B — Frontend funcional y persistencia (P0)

#### 06B-01 · Fuente compartida de tareas y completaciones

- **Estado** — Completado, aprobado y commiteado por el propietario.
- **Objetivo y alcance** — Dar a Activities y Learning acceso al mismo estado de tareas y completaciones provisionales tipadas, disponible para Life en un objetivo posterior. El frontend provisional de este objetivo precede a la conexión con Supabase.
- **Aceptación** — Cada ruta puede leer los datos al entrar directamente. Cada tarea tiene identidad estable por cuenta y una escalera. Cada completación identifica su tarea y fecha local. Diseño 06A conservado, estado en memoria y contrato reutilizable con Supabase. Build, lint y formato pasan.
- **Skills** — `architecture-guardian` y `ub-mode`.
- **Verificación técnica** — Build, lint y formato pasaron. Una prueba de renderizado de rutas directas y de los datos provisionales comprobó los checks deshabilitados, las identidades estables, la separación por cuenta y la fecha local. La revisión visual corresponde al propietario.
- **Commit propuesto** — `feat(ladders): establish shared task state`.

#### 06B-02 · Marcación diaria de tareas en memoria (P0)

- **Estado** — En revisión del propietario.
- **Objetivo y alcance** — Habilitar la marcación y desmarcación en Activities y Learning desde `useTasks()` y el estado del layout privado. Las completaciones son la fuente del estado de las casillas.
- **Aceptación** — Una completación por tarea y fecha local. Desmarcar elimina solo la del día actual. Los registros históricos permanecen intactos. Las casillas reflejan los datos al navegar y al cambiar de fecha. El estado está aislado por cuenta. Build, lint y formato pasan. La revisión visual corresponde al propietario.
- **Skills** — `architecture-guardian` y `ub-mode`.
- **Verificación técnica** — Build, lint y formato pasaron. En Edge sin interfaz se verificaron marcación, desmarcación, actualizaciones consecutivas sin duplicados, historial intacto, navegación privada, cambio de fecha y aislamiento al cambiar de cuenta.
- **Commit propuesto** — `feat(tasks): enable daily task completion`.

#### CRUD y casillas persistentes

- [ ] Crear tareas hasta cuatro activas por escalera; reutilizar TaskCard y componentes de Activities/Learning; validar título.
- [ ] Renombrar tareas y conservar identidad; la interfaz React 06A no equivale a una mutación persistente.
- [ ] Implementar marcación y desmarcación por **fecha local**; una completación por tarea por día; gestionar errores y rollback de operaciones optimistas.
- [ ] Implementar retiro/`Delete Card` **solo después** de cerrar el caso del apartado B; conservar historial.
- [ ] Mantener Health en sus tres metas fijas, con datos fechados independientes de tareas Activities/Learning.

**Cierre:** operaciones correctas tras navegación, recarga y cambio de cuenta; no duplicados; estados vacío/carga/error accesibles.

### E. 06B — Contadores y fechas v2.2 (P0)

Fórmulas únicas de aceptación:

```text
activitiesToday = completaciones de Activities con completed_date === hoyLocal
learningToday   = completaciones de Learning con completed_date === hoyLocal
lifeToday       = activitiesToday + learningToday

activitiesTotal = completaciones de Activities con completed_date < hoyLocal
learningTotal   = completaciones de Learning con completed_date < hoyLocal
lifeTotal       = activitiesTotal + learningTotal
```

- [ ] Actualizar `utils/progress.ts` o el módulo puro existente, reutilizando el servicio de fechas local. Todos los contadores derivados de completaciones válidas por cuenta.
- [ ] Marcar suma hoy +1, desmarcar resta hoy −1; hoy no altera totales históricos. Life suma los **números**, no el número de SectionCards.
- [ ] Cambio de día: nuevo día inicia sin checks y diarios cero si aún no hay completaciones; los registros anteriores **ya** entran al histórico, sin moverlos ni borrar datos, ni cron de medianoche.
- [ ] Verificar retorno tras varios días sin abrir aplicación, zona horaria local coherente, cambio de ruta/cuenta, eventos duplicados.
- [ ] Prueba de referencia: lunes histórico Activities 8, Learning 12, Life 20; Learning marca tres -> Life hoy 3, Life total 20. Martes sin nuevos checks -> Life hoy 0, Learning total 15, Life total 23.
- [ ] Probar renombrado/retiro sin pérdida de pasos históricos; no resolver caso de retiro marcado hoy por intuición.

**Cierre:** coinciden todas las vistas y pruebas de días cerrados sin duplicación.

### F. Health, racha y días desde alta (P0/P1 según dossier)

- [ ] **06B-06 · Conservar los checks de Health entre rutas — Pendiente.** Actualmente los checks se reinician al volver a Health. El objetivo se acepta cuando los cambios del día se conservan al salir y volver por rutas privadas sin mezclar cuentas. Skills: `architecture-guardian` y `ub-mode`. Commit propuesto: `feat(health): retain daily checks across routes`.
- [ ] Health: tres casillas fechadas; verde 3, amarillo 1–2, amarillo 0 si ayer tuvo checks, rojo 0 si ayer tuvo cero, amarillo primer día con cero.
- [ ] Health no aporta pasos a Life. Semáforo de Health en Life = círculo de color con texto accesible; no marca de tarea.
- [ ] Racha de **días cerrados** conforme a la sección 02.8 del dossier; no derivarla de `lifeTotal`. Días desde alta es otra métrica.
- [ ] Casos de cero pasos, dos días consecutivos, primer día y retorno después de varios días.

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
| Mar 24 | Sincronizar documentos y revisar estado local; cerrar regla de eliminación si es posible | No confundir edición documental con aplicación de SQL |
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

**Instrucción corta para Codex:** «Proyecto ADHD Ladder, TripleTen Etapa 1. `docs/dossier.md` v2.2 es la fuente normativa; `AGENTS.md` y Architecture Guardian son instrucciones operativas. Para `Your total steps` solo cuentan `completed_date < todayLocalDate`; Life es la suma Activities + Learning y Health no suma pasos. No alteres historias al retirar tarjetas ni resuelvas sin permiso la eliminación de una tarjeta marcada hoy. Trabaja solo en la tarea indicada, sin commits, push, merge, migraciones ni nuevas dependencias sin autorización. Describe cambios y pruebas reales».
