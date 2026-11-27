# ADHD Ladder · Guía de incorporación

ADHD Ladder ayuda a organizar actividades, aprendizaje y hábitos mediante pequeñas metas diarias. Life reúne el progreso de Activities y Learning, el nivel de Health, la racha y una frase a demanda. El repositorio usa npm Workspaces con React, React Router y Vite en `client/`, y Express con TypeScript en `server/`.

**Estado.** La base de Etapa 1 usa Supabase Auth y mantiene los datos del producto en memoria durante la sesión privada. El plan deja pendientes la aceptación manual con Auth real, la decisión de despliegue y el PR de Etapa 1. `07-PRES` mantiene suspendida la elección de persistencia y autenticación de Etapa 2. Supabase PostgreSQL y la propuesta con MongoDB Atlas, Mongoose y JWT son antecedentes o alternativas en evaluación. [Dossier §03](../docs/dossier.md) · [Estado de 07-10 y Etapa 2](../docs/plan-de-trabajo.md)

## Mapa y orden de lectura

El [grafo de referencia](knowledge-graph.json) corresponde a `stage-frontend` en `c0305f7536efee2cc1c65aa61621f419c797a6c7`. Para abrir una ruta de código, busca el ID `file:<ruta>` o usa el panel **Files**. Para entender el impacto, sigue `imports`, `calls`, `reads_from` y `publishes` en ambas direcciones.

| Paso del tour | Lectura y capa |
| --- | --- |
| 1. Del documento a las rutas | **Estructura y configuración.** [client/index.html](../client/index.html) → [client/src/main.tsx](../client/src/main.tsx) → [client/src/app/App.tsx](../client/src/app/App.tsx). |
| 2. Del arranque a una cuenta | **Rutas y sesión.** [client/src/context/AuthContext.tsx](../client/src/context/AuthContext.tsx) y [client/src/app/AuthRoutes.tsx](../client/src/app/AuthRoutes.tsx). |
| 3. Estado privado que cruza rutas | **Estado y reglas de dominio.** [client/src/hooks/useLadderSession.ts](../client/src/hooks/useLadderSession.ts), [useTasks.ts](../client/src/hooks/useTasks.ts) y [useHealth.ts](../client/src/hooks/useHealth.ts). |
| 4. De una tarjeta al historial | **Páginas y componentes.** [LadderPage.tsx](../client/src/pages/LadderPage/LadderPage.tsx) → [TaskCard.tsx](../client/src/components/TaskCard/TaskCard.tsx) → [tasks.ts](../client/src/utils/tasks.ts) y [taskCompletions.ts](../client/src/utils/taskCompletions.ts). |
| 5. De Health y las marcas a Life | **Páginas y dominio.** [Health.tsx](../client/src/pages/Health/Health.tsx), [Life.tsx](../client/src/pages/Life/Life.tsx), [progress.ts](../client/src/utils/progress.ts) y [health.ts](../client/src/utils/health.ts). |
| 6. Revelación de una frase | **Estado y reglas de dominio.** [useDailyQuote.ts](../client/src/hooks/useDailyQuote.ts) → [quotesApi.ts](../client/src/utils/quotesApi.ts). |
| 7. La API local | **API Express.** [client/vite.config.ts](../client/vite.config.ts), [server/src/app.ts](../server/src/app.ts), [server/src/routes/index.ts](../server/src/routes/index.ts) y [error-handler.ts](../server/src/middleware/error-handler.ts). |
| 8. Migraciones y decisiones de entrega | **Migraciones históricas y contratos y entrega.** [Supabase](../supabase/migrations/) · [Verificación histórica](../supabase/tests/07-01-task-integrity.md) · [07-AUD](../docs/07-AUD-cumplimiento-academico.md) · [Rúbrica de Etapa 2](../docs/Etapa_2_checklist.md). |

Para una primera revisión, empieza por [AGENTS.md](../AGENTS.md), lee el propósito y arranque en [README.md](../README.md), y sigue los pasos 1–5. Después consulta el contrato correspondiente en el [dossier §02](../docs/dossier.md), el objetivo del [plan](../docs/plan-de-trabajo.md) y los pasos 6–8 según el alcance.

## Contratos que conviene comprobar

- **Sesión e identidad.** `AuthProvider` publica restauración, sesión, registro, entrada y salida en React Context. Se suscribe a Supabase antes de pedir `getSession` y prioriza eventos posteriores frente a una respuesta inicial tardía. `ProtectedRoute` muestra Landing en `/` sin sesión y Life en `/` o `/life` con sesión. `/about` es pública. Comprueba acceso directo, error de restauración, salida y cambio de cuenta. [AuthContext.tsx](../client/src/context/AuthContext.tsx) · [AuthRoutes.tsx](../client/src/app/AuthRoutes.tsx)
- **Recursos privados.** `PrivateLayout` se identifica por `session.user.id` y publica `LadderSession` por Outlet Context. Tareas, completaciones, borradores, Health y frases sobreviven al cambio de ruta dentro de ese layout. Un desmontaje o cambio de cuenta reinicia esos recursos. Activities y Learning comparten `LadderPage`. Comprueba que Life y las rutas de cada recurso funcionen desde una URL directa. [AuthRoutes.tsx](../client/src/app/AuthRoutes.tsx) · [useLadderSession.ts](../client/src/hooks/useLadderSession.ts)
- **Tareas y calendario.** Hay hasta cuatro activas por escalera y se conserva al menos una. Hay una completación por tarea y fecha. El renombrado efectivo y el retiro corrigen solo la marca del día y conservan el histórico. Today cuenta el día actual y Total los anteriores. Comprueba el salto de medianoche, regreso tras un intervalo y fecha tomada al actuar. En popups, Escape o cierre exterior conservan el borrador y Cancel lo descarta. [dates.ts](../client/src/utils/dates.ts) · [useLocalDateKey.ts](../client/src/hooks/useLocalDateKey.ts) · [dossier §§02.2–02.6](../docs/dossier.md)
- **Health y racha.** Hay cuatro niveles. Un registro explícito con las tres metas desmarcadas fija nivel cero y un día ausente decae. Health aporta cero pasos y afecta la elegibilidad para la racha de días cerrados. El texto y el nivel se comparten con Life. [health.ts](../client/src/utils/health.ts) · [progress.ts](../client/src/utils/progress.ts) · [dossier §§02.7–02.8](../docs/dossier.md)
- **APIs y SQL.** El navegador usa Fetch directo a DummyJSON. El hook valida el resultado, deduplica, maneja carga, error, vacío y reintento, y cancela solicitudes obsoletas. Express ofrece `GET /api/healthz` y errores JSON bajo `/api`. Las migraciones conservan tablas, RLS y mutadores históricos. Su despliegue y los permisos efectivos quedan sin verificar, y la aplicación actual mantiene sus recursos en memoria. [quotesApi.ts](../client/src/utils/quotesApi.ts) · [server/src/app.ts](../server/src/app.ts) · [Migraciones](../supabase/migrations/)

El grafo marca `AuthRoutes.tsx`, `AuthContext.tsx`, `LadderPage.tsx`, `Life.tsx` y `useDailyQuote.ts` como archivos complejos. Prioriza cambios pequeños en esos puntos y sigue sus consumidores cuando se toquen tipos compartidos, fecha o estado. Los contratos de [AGENTS.md](../AGENTS.md) y del [dossier](../docs/dossier.md) son la referencia para aceptar comportamiento.

## Desarrollo y consulta

Usa Node.js 24 y npm. La instalación de dependencias, las plantillas públicas de entorno y las instrucciones de acceso están en el [README](../README.md#instalación-y-ejecución). Desde la raíz, `npm run dev` arranca ambos workspaces, y `npm run dev:client` o `npm run dev:server` arranca cada uno por separado. El frontend usa **5173** y Express **3000** por defecto. Para cambios de código, ejecuta las comprobaciones pertinentes y `npm run build`, `npm run lint`, `npm run format:check` y `git diff --check`.

En el equipo que tiene el lanzador configurado, ejecuta `.\.ua\launch-dashboard.cmd` desde la raíz y abre el enlace local que imprima. Usa **5174** con puerto estricto y token temporal. La invocación directa de `$understand-dashboard` conserva su puerto predeterminado **5173**. Para otro equipo, consulta la [configuración local en MAP-02](MAP-02.md#dashboard-local).

Antes de cambiar código, consulta solo nodos y consumidores relevantes. Para una revisión de impacto, usa `$understand-diff` cuando aporte cobertura adicional. Tras un commit aprobado que haga la propietaria, revisa rama, hash y estado, y ejecuta `$understand --no-auto-update` con la base correspondiente. Mantén `autoUpdate=false`. [Flujo incremental y selección de skills](MAP-02.md)

Architect Mode dirige decisiones, planificación y revisión. UB Mode ayuda a mantener simplicidad y reutilización semántica. Ciber Security cubre límites de confianza y seguridad. Understand Anything aporta navegación y evidencia de dependencias. [Reglas operativas](../AGENTS.md) · [Metodología](../docs/Architect.md)
