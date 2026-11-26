# 07-AUD · Cumplimiento académico y transición de autenticación

**Línea base del 25/11/2026.** `stage-frontend` en `92643be`, cinco commits por delante de la referencia local `origin/stage-frontend`. 07-ARQ, 07-ROOT, 07-REL y 07-EXP conservan sus commits verificados. El cliente React/Vite usa Supabase Auth y mantiene tareas y Health en memoria. Express tiene un router base con `/api/healthz`, errores JSON y proxy de Vite. `server/package.json` declara Express como dependencia de ejecución. La arquitectura Atlas y JWT ya está aprobada y sus funciones permanecen pendientes.

**Fuentes.** Etapa 1 cotejada con el PDF oficial de tres páginas, leído desde `../Resources/requirements/Etapa_1_aplicacion_front_end.pdf`, y con la lección local 1.2. El árbol local no contiene un checklist Markdown de Etapa 1. Sus IDs E1 se asignan aquí según orden y sección. La transcripción local `Etapa_2_checklist.md` conserva sus IDs y se cotejó con el PDF oficial de cuatro páginas. [PDF oficial de Etapa 1](https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_17_refactored/ES/V10/Etapa_1_aplicacion_front_end.pdf).

**Lectura.** Verificado = evidencia suficiente en la línea base para ese criterio. Parcial = evidencia de una parte o falta comprobación representativa. Pendiente = requisito ausente o paso de entrega por realizar. Sin verificar = depende de evidencia no disponible. N/A = la condición de la rúbrica no se cumple. En las tablas de rechazo, «verificado» indica que se descartó el motivo con la evidencia indicada. La columna final remite al [único plan](plan-de-trabajo.md).

## Etapa 1 · Motivos de rechazo

| ID | Estado | Evidencia o archivo | Acción y objetivo |
|---|---|---|---|
| E1-D01 | Pendiente | Existe `stage-frontend`. La consulta GitHub no devolvió PR con base `main`. | Publicar la revisión correspondiente y entregar la URL del PR, 07-10. |
| E1-D02 | Parcial | Build con dependencias existentes. En `npm run dev` arranca Vite y `tsx` falla en `os.userInfo` con `uv_os_get_passwd ENOMEM`. Express compilado y proxy responden. | Volver a probar instalación limpia y arranque exacto en entorno autorizado, 07-10. |
| E1-D03 | Parcial | DummyJSON devolvió JSON desde la consulta web. Prueba del adaptador con respuestas controladas exitosa. La solicitud local real fue bloqueada por red (EACCES); falta verla en Life. | Acreditar datos reales visibles en Life con acceso de evaluador, 07-10. |
| E1-D04 | Sin verificar | El PDF activa este motivo si Etapa 1 es entrega final frontend. La lección 1.2 permite desplegar después si sigue full stack. El proyecto aún exige evidencia de despliegue. | Confirmar modalidad y momento del despliegue con TripleTen. Verificar recarga SPA en la URL pública cuando corresponda, 07-10 y 07-11. |
| E1-D05 | Sin verificar | No se aportó retroalimentación académica anterior. | Confirmar si existe y cerrar errores críticos aplicables, 07-10. |

## Etapa 1 · Criterios puntuados

| ID | Criterio | Estado | Evidencia o archivo | Acción y objetivo |
|---|---|---|---|---|
| E1-C01 | Vite y TypeScript | Verificado | `client/package.json`, `client/src`, `server/src`. | Conservar, 07-10. |
| E1-C02 | Build sin errores TS | Verificado | `npm run build` pasó en ambos workspaces. | Repetir en la versión candidata, 07-10. |
| E1-C03 | Lint sin errores | Verificado | `npm run lint` pasó en ambos workspaces. | Repetir en la versión candidata, 07-10. |
| E1-C04 | Estructura de carpetas | Verificado | `client/src/{components,styles,images,utils,vendors}` y fuentes Fontsource. | Conservar, 07-10. |
| E1-C05 | README nombre, descripción, stack y URL si desplegado | Parcial | README contiene nombre, propósito, stack e instalación. Falta confirmar la condición de publicación y su URL. | Añadir URL cuando corresponda, 07-10 y 07-12. |
| E1-C06 | Responsive desde 320 px sin scroll horizontal encubierto | Parcial | Reglas responsive comprobadas en CSS. La revisión anterior informó pruebas de 320–1440 px. Falta repetir en navegador para esta revisión. | Revisar visualmente la candidata, 07-10. |
| E1-C07 | HTML semántico | Verificado | `Landing`, `Life`, `AuthPage`, `Health` y `LadderSelector` usan estructura y controles semánticos. | Conservar, 07-10. |
| E1-C08 | Flex o Grid | Verificado | CSS de Landing, Health y LadderPage. | Conservar, 07-10. |
| E1-C09 | Reset y fuentes | Verificado | `main.tsx` importa `vendors/normalize.css` y Fontsource. | Conservar, 07-10. |
| E1-C10 | Reuso y props tipadas | Verificado | `AuthPage`, `TaskCard`, `LadderPopup` y páginas de escaleras. | Conservar, 07-10. |
| E1-C11 | Rutas de funcionalidad y About, navegación | Parcial | `App.tsx`, `AuthRoutes.tsx` y React Router 8.5.2. La funcionalidad exige sesión. La guía oficial confirma la transición desde `react-router-dom`. | Acreditar navegación y acceso del evaluador. Confirmar equivalencia académica del paquete, 07-10. |
| E1-C12 | Hooks sin condicionales ni bucles | Verificado | Revisión de componentes y hooks, más lint con reglas de hooks. | Conservar, 07-10. |
| E1-C13 | Claves de lista estables | Verificado | `LadderPage`, `Life`, `Health` y `LadderSelector` usan IDs, rutas o claves de dominio. | Conservar, 07-10. |
| E1-C14 | Fetch externo en utils | Verificado | `client/src/utils/quotesApi.ts` llama a DummyJSON directamente. | Conservar separado del cliente privado, 07-AUTH-UI y 07-10. |
| E1-C15 | Respuesta third-party tipada | Verificado | `quotesApi.ts` valida `unknown` y transforma a `Quote`. | Conservar, 07-10. |
| E1-C16 | Carga visible y retirada al resolver | Parcial | `useDailyQuote.ts` y `Life.tsx`, código de estado visible y transición a éxito inspeccionados. | Verificar transición en Life, 07-10. |
| E1-C17 | Error visible al fallar | Parcial | `useDailyQuote.ts` y `Life.tsx`, el adaptador rechaza un HTTP 503 simulado y el componente tiene mensaje y reintento. | Verificar fallo y reintento, 07-10. |
| E1-C18 | Clave externa en variable y ejemplo | N/A | DummyJSON es público. Supabase tiene su propio ejemplo saneado. | Registrar que el proveedor de frases funciona sin clave, 07-10. |
| E1-C19 | Artefactos excluidos de Git | Verificado | `.gitignore` y `git ls-files`, con ejemplos de entorno versionados. | Revalidar antes del PR, 07-10. |
| E1-M01 | Estado inicial tipado | Verificado | `AuthContext.tsx`, `useDailyQuote.ts`, estado privado y borradores. | Conservar, 07-10. |
| E1-M02 | Tipos compartidos en archivos propios | Verificado | `client/src/types` y `authContextValue.ts`. | Conservar, 07-10. |
| E1-M03 | Paginación para listas largas | N/A | El endpoint de frases devuelve un resultado por solicitud. | Conservar, 07-10. |
| E1-M04 | Aviso cuando no hay resultados | Parcial | `useDailyQuote.ts` y `Life.tsx`, el adaptador devuelve `null` en respuesta vacía o inválida y el código presenta un mensaje. | Verificar respuesta vacía, 07-10. |
| E1-M05 | Constantes en mayúsculas en configuración | Parcial | `client/src/config/constants.ts` reúne límites. La URL externa vive en `quotesApi.ts`. | Revisar solo constantes que incumplan el criterio al preparar 07-10. |
| E1-M06 | Retiro de listeners al desmontar | Verificado | `LadderSelector`, `LadderPopup`, `LadderTooltip` y `useLocalDateKey` limpian las suscripciones. | Conservar, 07-10. |
| E1-M07 | Placeholders, required y foco | Verificado | `AuthPage.tsx`, `AuthPage.css` y `EditBubble.tsx`. | Verificar foco en la candidata, 07-10. |
| E1-M08 | Botones y enlaces reales | Verificado | `Header`, `AuthPage`, `Life`, `Health` y controles modales usan elementos nativos. | Conservar, 07-10. |
| E1-M09 | SVG e imágenes optimizadas | Verificado | SVG vectorial en componentes y favicon, ilustraciones WebP. | Conservar, 07-10. |
| E1-M10 | Limpieza del template Vite | Verificado | `client/public`, `client/index.html` y árbol fuente sin recursos de demostración de Vite. | Conservar, 07-10. |
| E1-R01 | Fallback de fuentes | Verificado | `client/src/styles/variables.css` y fuentes del sistema. | Conservar, 07-10. |
| E1-R02 | Texto alternativo adecuado | Verificado | `LadderArtwork` y `Landing` usan `alt=""` en ilustraciones decorativas. | Conservar, 07-10. |
| E1-R03 | Hover visible | Verificado | CSS de Header, Life, Landing, formularios y popups. | Conservar, 07-10. |
| E1-R04 | Formato y código limpio | Parcial | Formato y lint pasan. Revisión de fuentes representativas, sin certificación de código muerto en todo el cliente. | Revisar solo consumidores con cambios y defectos observados, 07-10. |
| E1-R05 | Mensajes de commit descriptivos | Verificado | Los cinco commits locales por delante describen arquitectura, rutas, reubicación y Express. | Mantener mensajes descriptivos, 07-10. |

**Puntuación provisional respaldada.** **69,23 de 99,99** nominales (13 de desempeño, 7 de mejores procedimientos y 4 recomendaciones verificados). Es un mínimo de puntos con evidencia, sin crédito para parciales, desconocidos o N/A y sin reescalar. Los motivos de rechazo se evalúan aparte. [Equivalencia oficial de React Router](https://reactrouter.com/upgrading/v7#react-router-dom).

## Etapa 2 · Motivos de rechazo

| ID | Estado | Evidencia o archivo | Acción y objetivo |
|---|---|---|---|
| E2-D01 | Pendiente | Sin referencia `stage-fullstack` local. GitHub encontró `stage-frontend` en la búsqueda y ningún PR de `stage-fullstack` a `main`. | Crear la rama con autorización desde la base académica acordada y entregar su propio PR, 07-12. |
| E2-D02 | Parcial | Scripts presentes, Express compilado responde. El arranque combinado falla en `tsx` en este entorno, E1-D02. | Revalidar el comando exacto con dependencias limpias y Atlas disponible, 07-01 y 07-09. |
| E2-D03 | Pendiente | El router solo ofrece estado y 404. El cliente aún usa Supabase. | Probar registro válido e inicio de sesión por API y en la URL pública, 07-REG, 07-LOGIN y 07-11. |
| E2-D04 | Pendiente | Configuración pública ausente en el árbol y el README. Sin URLs ni comprobación de Atlas. | Demostrar frontend, API y Atlas desplegados, 07-01 y 07-11. |
| E2-D05 | Sin verificar | No se aportó revisión académica de Etapa 2. | Confirmar feedback y corregir críticos aplicables, 07-09 y 07-12. |

## Etapa 2 · Criterios puntuados

| ID | Criterio | Estado | Evidencia o archivo | Acción y objetivo |
|---|---|---|---|---|
| E2-C01 | Server TypeScript con configuración propia | Verificado | `server/{package.json,tsconfig.json,eslint.config.js,src}`. | Conservar, 07-01. |
| E2-C02 | Scripts dev, build, start y lint | Parcial | Scripts declarados, build/lint y start compilado pasan. El arranque con recarga falla aquí. | Verificar recarga y arranque exacto, 07-01 y 07-09. |
| E2-C03 | BD, puerto, JWT, origen y ejemplos de entorno | Parcial | `server/.env.example` solo tiene `PORT`. `.env` se excluye. | Añadir `MONGODB_URI`, `JWT_SECRET` y `CLIENT_ORIGIN` conforme se usen, 07-01, 07-LOGIN y 07-11. |
| E2-C04 | Usuario y recurso con dueño obligatorio | Pendiente | Sin modelos Mongoose. | User y Task con identidad de propietario requerida, 07-REG y 07-03. |
| E2-C05 | Correo obligatorio y único, hash | Pendiente | Sin esquema propio ni bcrypt en el servidor. | Validar e indexar correo normalizado y guardar hash bcrypt, 07-REG. |
| E2-C06 | Respuestas sin contraseña ni hash | Pendiente | Aún no existen respuestas de las rutas de cuenta propias. | Selección y DTO explícitos, QA de respuestas y logs, 07-REG, 07-LOGIN, 07-AUTH y 07-09. |
| E2-C07 | Registro y login públicos, JWT en login | Pendiente | Sin rutas. El plan propone prefijo `/api`. | Probar contratos y acordar prefijo o alias exactos, 07-REG y 07-LOGIN. |
| E2-C08 | Perfil propio, leer, crear y eliminar recurso | Pendiente | Sin rutas de cuenta ni tareas. | Perfil y CRUD con DELETE archivado sujeto a aceptación académica, 07-AUTH, 07-04/05 y 07-05A/06. |
| E2-C09 | Middleware JWT, 401 en privadas | Pendiente | Sin middleware. `/api/healthz` público corresponde a E2-M05. | Aplicar a rutas privadas y registrar excepción explícita de salud, 07-AUTH. |
| E2-C10 | Propiedad de recursos y 403 | Pendiente | Aislamiento en memoria de React. El plan anterior reservaba 404 para recursos invisibles. | Filtrar por dueño y acordar tratamiento genérico 403 para borrado ajeno, 07-05A/06 y 07-09. |
| E2-C11 | Router por recurso | Pendiente | Solo `server/src/routes/index.ts`. | Incorporar routers por recurso al mismo índice, 07-REG, 07-AUTH, 07-04/05 y 07-07. |
| E2-C12 | Validar cuerpo antes de BD y esquema | Parcial | Express limita y parsea JSON. Faltan validaciones de dominio. | Controlador valida obligatoriedad y tipos, Mongoose aplica esquema, 07-REG a 07-07. |
| E2-C13 | Error central y sin datos internos | Verificado | `middleware/error-handler.ts` devuelve errores saneados y 500 genérico. HTTP 400 y 404 probados. | Extender mapeo y revalidar con Mongoose, 07-REG y 07-09. |
| E2-C14 | Estados correctos y 429 en ambas rutas de Auth | Parcial | Probados 400/404. Falta limitador propio y los demás casos de dominio. | Aplicar 429 a registro e inicio de sesión y comprobar semántica completa, 07-REG, 07-LOGIN y 07-09. |
| E2-C15 | `VITE_API_URL` | Pendiente | Proxy Vite presente. Sin cliente HTTP para Express ni variable pública. | Leer URL base desde entorno, 07-AUTH-UI. |
| E2-C16 | Formularios y errores del servidor | Parcial | `AuthPage.tsx` usa mensajes de `AuthProvider` con Supabase. | Exponer errores saneados de Express en los formularios, 07-AUTH-UI. |
| E2-C17 | JWT en `localStorage` y Bearer leído por solicitud | Pendiente | SDK actual gestiona sus credenciales. Dossier propone `sessionStorage`. | Decidir almacenamiento exigido y probar cliente propio, 07-AUTH-UI. |
| E2-C18 | Restaurar mediante API propia y borrar token inválido | Parcial | `AuthContext.tsx` restaura con el proveedor anterior. | Validar con `/api/users/me`, limpiar en 401 vigente y permitir reintento transitorio, 07-AUTH-UI. |
| E2-C19 | `CurrentUserContext.Provider` y estado global | Parcial | `main.tsx` monta `AuthProvider` con un `createContext`. | Reusar y renombrar el contexto existente según aprobación frontend, 07-AUTH-UI. |
| E2-C20 | Header por sesión y salida a público | Parcial | Layouts diferenciados y logout implementado con Supabase. | Verificar limpieza JWT y retorno con Express, 07-AUTH-UI. |
| E2-C21 | Página propia con ruta privada | Parcial | `ProtectedRoute`, `App.tsx` y enlace directo a `/activities`. La redirección y el layout diferenciado están en código; falta probarlos con sesión propia. | Revalidar con API y datos reales, 07-AUTH-UI y 07-09. |
| E2-C22 | Crear y eliminar propios desde UI sin recarga | Parcial | `AuthRoutes.tsx` actualiza tareas en memoria. | Integrar altas y DELETE archivado, verificar cambios y persistencia, 07-09A. |
| E2-C23 | Atlas con usuario de BD | Pendiente | No hay Mongoose, URI ni verificación Atlas. | Conectar en entorno autorizado con permisos acotados, 07-01. |
| E2-C24 | URLs públicas de frontend y API en README | Pendiente | README sin URLs de despliegue propias. | Publicar y listar URLs, 07-11 y 07-12. |
| E2-C25 | Flujo público y CORS de origen real | Pendiente | Sin configuración CORS propia ni prueba pública. | Restringir al origen real y probar el flujo desde navegador, 07-11. |
| E2-M01 | Longitud mínima en servidor | Pendiente | Sin registro propio. | Validar mínimo y límite UTF-8 compatible con bcrypt, 07-REG. |
| E2-M02 | JWT expira y payload identifica solo a la persona | Pendiente | Sin dependencia JWT propia. | Emitir `sub` y claims técnicos de tiempo, sin datos de perfil, 07-LOGIN y 07-AUTH. |
| E2-M03 | `trust proxy` según plataforma | Pendiente | `server/src/app.ts` escucha en loopback sin ajuste. | Configurar según la topología real y verificar identificación para el limitador, 07-11. |
| E2-M04 | `maxPoolSize` en Mongoose | Pendiente | Sin conexión Mongoose. | Fijar y verificar un límite acorde al entorno de Atlas, 07-01. |
| E2-M05 | Estado público independiente de token y BD | Verificado | `GET /api/healthz` devuelve 200 y no consulta Auth ni BD. | Preservar respuesta durante indisponibilidad de BD, 07-01 y 07-09. |
| E2-M06 | 404 claro | Verificado | El router devuelve 404 JSON en ruta inexistente bajo `/api`. | Conservar con routers y fallback, 07-11. |
| E2-M07 | Middleware de error en módulo propio | Verificado | `server/src/middleware/error-handler.ts`. | Conservar, 07-09. |
| E2-M08 | Índice conecta routers | Parcial | `app.ts` monta un índice, sin routers de recursos aún. | Agregar por recurso, 07-REG, 07-AUTH, 07-04/05 y 07-07. |
| E2-M09 | Mensajes y constantes aparte | Parcial | `utils/errors.ts` define `HttpError`. Mensajes y límites residen en el uso actual. | Centralizar los mensajes y constantes compartidos del servidor conforme se incorporen, 07-REG y 07-LOGIN. |
| E2-M10 | Carga visible al llamar API propia | Parcial | Formularios y restauración ya muestran pendiente con el proveedor anterior. | Conservar el patrón para Auth y datos persistidos, 07-AUTH-UI y 07-09A/B. |
| E2-M11 | Respuestas propias tipadas en cliente | Pendiente | `quotesApi.ts` tipa la API externa. Falta contrato Express. | Tipar y validar respuestas privadas en su cliente Fetch, 07-AUTH-UI y 07-09A/B. |
| E2-M12 | Comandos en raíz | Verificado | Paquete raíz con workspaces y comandos de ambas partes. | Conservar y comprobar sobre instalación limpia, 07-09. |
| E2-R01 | Feedback tras acciones | Parcial | Formulario y controles cambian de estado, faltan confirmaciones de mutaciones persistidas. | Confirmar éxito accesible con el patrón existente, 07-AUTH-UI y 07-09A/B. |
| E2-R02 | Formato, nombres, código limpio | Parcial | Formato y lint pasan. Código base acotado, sin revisión exhaustiva de consumidores durante transición. | Verificar código tocado y SDK sin consumidores al sustituir Auth, 07-AUTH-UI y 07-09. |
| E2-R03 | Commits descriptivos | Verificado | Historial local reciente de hitos con mensajes descriptivos. | Mantener un objetivo por commit, 07-12. |

**Puntuación provisional respaldada.** **13,07 de 100,01** nominales (2 de desempeño, 4 de mejores procedimientos y 1 recomendaciones verificados). Solo criterios verificados, sin crédito por parciales, y sin convertir la fundación Express en aprobación de Etapa 2.

## Decisiones de aceptación

- **Ramas y plazo.** El envío de Etapa 1 usa `stage-frontend → main`. El de Etapa 2 usa `stage-fullstack → main`. Confirmar cuál es exigible antes del 30/11, secuencia de revisión e integración, necesidad de URL pública en Etapa 1 para esta trayectoria y acceso del evaluador a Life con una cuenta de prueba. Una sola entrega no acredita las dos etapas.
- **Rutas y estados.** Conservar `/api` como base. Documentar `/signup` y `/signin` relativos a esa base. Si el evaluador exige las dos rutas literales desde la raíz, añadir alias POST a los mismos handlers y limitadores en una sola instancia de cada control. Proponer 403 genérico al rechazar DELETE fuera del conjunto autorizado, con el mismo mensaje para ID ajeno o ausente cuando sea necesario evitar revelar existencia. Mantener filtro de propietario y API 404 para rutas desconocidas. Confirmar la semántica académica y de producto.
- **DELETE e historial.** Demostrar DELETE sobre una tarea propia, retiro inmediato del listado, persistencia tras recargar, rechazo de la última activa y conservación del histórico. Confirmar que ese resultado satisface E2-C08/C10/C22. Si la rúbrica exige borrado físico, elevarlo como conflicto de producto a la propietaria y al evaluador.
- **Sesión.** E2-C17 exige explícitamente `localStorage`; la propuesta anterior usa `sessionStorage`. Para cumplimiento literal, proponer JWT breve, Bearer solo hacia la API propia y limpieza al cerrar sesión o recibir 401 del token vigente. Si se acepta equivalencia, conservar la opción de menor persistencia. Ambos guardan un token accesible a JavaScript. Reusar el único contexto y dejar `CurrentUserContext.Provider` como nombre del proveedor existente si se exige literalidad.
- **Infraestructura.** Configurar `VITE_API_URL` y `CLIENT_ORIGIN` con los destinos reales, publicar URLs distinguibles de frontend y API y comprobar CORS. Confirmar si el producto puede usar un mismo origen con base `/api`. Ajustar `trust proxy` a la infraestructura real. Mantener `/api/healthz` público y sin consulta a Atlas. Si el arranque bloqueado por MongoDB impide ese requisito, proponer iniciar HTTP con estado de proceso y responder 503 en rutas dependientes hasta disponer de conexión. [Configuración de proxy de Express](https://expressjs.com/en/guide/behind-proxies/).

## Inventario de Supabase

| Clasificación | Elementos y consumidores comprobados | Objetivo |
|---|---|---|
| Seguro de retirar ahora | Ningún artefacto ejecutable confirmado como huérfano. `README.md` todavía documenta un setup que usa el cliente. | Mantener el arranque actual hasta 07-AUTH-UI. |
| Retirar al integrar Auth propia | `client/src/utils/supabaseClient.ts` lo usa `AuthContext.tsx`. El SDK `@supabase/supabase-js` y sus transitivas están en `client/package.json` y `package-lock.json`. `AuthContext.tsx`, `authContextValue.ts` y `AuthRoutes.tsx` consumen sus tipos. `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY` están en el ejemplo y la declaración Vite. Existe `client/.env.local`; solo se comprobó su presencia. | 07-AUTH-UI sustituye llamadas y tipos, limpia ejemplo y lockfile tras comprobar consumidores, y actualiza el arranque documentado. 07-12 completa las instrucciones de publicación. |
| Retirar tras verificar conservación | Variables reales en el entorno de corte y uso del proyecto Supabase anterior. Inventariar usuarios, migraciones aplicadas, conteos y relaciones sin exponer información personal. Tareas, marcas y Health del cliente actual viven en memoria. Los artefactos SQL locales no acreditan el estado Cloud. | 07-MIG antes de sustituir un servicio anterior. Si hay cuentas o datos, aprobar respaldo, reconciliación y corte reversible, con prueba de control de identidad. |
| Conservar como lógica reutilizable | `AuthProvider`, `useAuth`, `AuthRoutes`, `AuthPage`, `useRegistrationDate` y consumidores como About. Mantener tipos de dominio y compatibilidad de `created_at`, IDs y propietarios desde DTOs según corresponda. `taskCompletions.ts`, `dates.ts`, `progress.ts`, `health.ts` y DummyJSON tienen consumidores vigentes. | 07-AUTH-UI y 07-09A/B. |
| Conservar como evidencia histórica | `supabase/migrations/20261123000000_create_user_tables.sql`, `20261123000100_add_user_table_policies.sql`, `20261124000000_enforce_task_and_completion_integrity.sql` y `supabase/tests/07-01-task-integrity.md`. Dossier, plan, `docs/Architect.md` y referencias de skills registran evolución y contratos. RLS y SQL quedan fuera del flujo MongoDB. Las referencias de skills están en `.agents/skills/architecture-guardian/SKILL.md` y `.agents/skills/architect-mode/references/guardian.md`. | 07-MIG coteja estado remoto con autorización separada. Los artefactos se conservan. |

## Verificaciones y límites

- Node 24.15.0, npm 12.0.2 y dependencias ya instaladas. Pasaron build, lint y formato en raíz. Vite emitió un aviso de bundle JS mayor a 500 kB y completó el build. No se reinstaló.
- Arranque exacto con `npm run dev` parcial por error `uv_os_get_passwd ENOMEM` del entorno al cargar `tsx`. Alternativa verificada: `npm run start --workspace server` con Vite, salud 200 por acceso directo y proxy, y errores JSON 400/404.
- Pruebas aisladas de utilidades: adaptador de DummyJSON con dato válido, vacío, JSON inválido, HTTP 503 y petición sin credenciales. Fecha local y corte lunes/martes, marca repetida, renombrado con ID estable, archivo con histórico, última activa y máximo de cuatro pasaron en memoria. La sesión de navegador de auditoría no pudo completarse. El endpoint público respondió en la consulta web, sin certificar visualización en la aplicación. [Endpoint público de DummyJSON](https://dummyjson.com/quotes/random).
- La consulta de GitHub fue de solo lectura y filtró por cabeza y base. La ausencia de resultados no certifica un envío en la plataforma académica. No se verificaron servicios Supabase, Atlas, despliegues ni crítica de una revisión anterior. Evidencia simulada o informes anteriores no acreditan login real ni persistencia.
