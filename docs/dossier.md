# ADHD Ladder — Dossier integral v2.1

> Transcripción estructurada del PDF original; las decisiones y fechas se preservan tal como aparecen en la versión 2.1.

Arquitectura: React + TypeScript + Vite + Supabase (Auth y PostgreSQL con RLS) + API externa de frases Producto · Lógica · Tecnologías · Checklist TripleTen · Brief y plan · Validación · Historial

Fecha de corte: 22 de noviembre de 2026 · Entrega objetivo: PR enviado el 28 o 29 de noviembre; plazo 30 de noviembre de 2026 Actualiza el dossier v2.0 (21/11/2026). Sigue siendo Etapa 1 (front-end) con Supabase, sin backend propio.

## Cambios respecto de v2.0

- Tiempo real: unas 30 horas útiles (≈3 h en días laborales; Mié 25 y Sáb 28 ≈7 h). Calendario rehecho con punto de control el martes 24.

- Health (regla B): 3 casillas verde; 1–2 amarillo; 0 casillas amarillo si ayer tuvo al menos una, rojo si ayer también tuvo 0; el primer día de la cuenta es amarillo.

- Racha: el estado de Health puede mantenerla en un día sin pasos; dos días sin pasos, o un día sin pasos con Health rojo, la reinician.

- Life = Activities + Learning. Health no suma pasos (corrige la regla 4 de v2.0). Life muestra total de hoy y total de la cuenta; Activities y Learning tienen su propio conteo diario y total.

- Cuentas nuevas empiezan con tareas de ejemplo. Eliminar = archivar. Las fechas son la fecha local del navegador.

- API de frases ≠ Supabase. Es un servicio público aparte consumido con fetch; proveedor aún por decidir (candidato sin verificar: DummyJSON). La frase va en Life.

- Flujo de trabajo: Dara decide y aprueba; Claude actúa como tech lead y revisor; ChatGPT/Codex escribe código en tareas pequeñas; se revisa cada rama antes de integrar.

- Riesgos nuevos: pausa del plan gratuito de Supabase, confirmación de email, About sin mockup, popups y mobile sin diseño, fuentes y archivos de assets por ajustar.

- Pendiente: confirmar con el tutor, por escrito, que Supabase es aceptable (recomendado, no bloqueante).

Convenciones: [DECIDIDO] aprobado por Dara; [PROP] propuesta técnica aún sin validar; [ABIERTO] requiere resolución. Los mockups no prueban funcionalidad construida. Ninguna parte de este documento demuestra que la app ya exista.

<!-- Página 2 del PDF original -->

## 01 · Producto y propósito

ADHD Ladder es una aplicación web de hábitos y progreso personal que convierte acciones pequeñas en «escalones» visibles. La persona organiza sus actividades en tres escaleras (Health, Activities y Learning) y ve su avance del día y acumulado en el panel Life, con la metáfora de una escalera y un personaje. Promesa de diseño: que el avance sea legible, acogedor y manejable.

### Problema y público

Las herramientas de productividad pueden volver el seguimiento una lista larga y abstracta. ADHD Ladder propone identificar el siguiente paso, marcarlo y reconocer el progreso acumulado. Hipótesis, no resultado validado: este formato podría reducir la fricción de empezar en personas que prefieren metas cortas y retroalimentación inmediata.

Público: personas que quieren organizar hábitos y pequeñas actividades diarias, incluidas quienes se identifican con dificultades de atención u organización. El nombre del producto no implica diagnóstico, tratamiento ni eficacia clínica. Los estados de Health reflejan metas autodeclaradas, nunca la salud de la persona.

### Propuesta de valor

- Un siguiente paso claro, en lugar de un panel saturado.

- Tres áreas de vida reconocibles con tareas independientes.

- Progreso diario y acumulado presentado visualmente.

- Interacciones cortas: completar, añadir y administrar tarjetas.

- Lenguaje amable; diseño con cremas, verdes y acentos naranja.

### Mapa de pantallas

| Pantalla | Qué muestra | Estado de diseño |
|---|---|---|
| Landing | Logo, About / Log in / Sign up, escalera, CTA «Take your first step ↑» hacia `/signup` | Mockup aprobado |
| Sign up / Log in | Email y contraseña; Go Back; enlace cruzado | Mockups aprobados |
| Life | Pasos de hoy (Activities + Learning), racha, total de hoy y de la cuenta, días en la escalera, accesos a las escaleras y tarjeta con la frase motivacional | Mockup; la frase no está dibujada, se decide al maquetar |
| Health | Semáforo de metas y tres metas diarias fijas (Good Nutrition, Good Sleep, Daily Movement) | Mockup aprobado |
| Activities / Learning | Tarjetas completables, contador diario, total propio, botón + | Mockups aprobados |
| About | Texto de la misión de la página y un párrafo corto sobre la autora (la rúbrica pide «Sobre el autor») | Sin mockup; solo texto |
| Popups | Selector de escalera; menú de tarjeta (Change Name / Delete Card); modal de añadir; confirmar borrado | Sin diseño; se especifican en texto |
| Mobile | Layouts bajo ~768 px y desde 320 px | Sin diseño; se define en texto y se construye mobile-first |

### Qué está confirmado y qué no

Confirmado: React/TypeScript/Vite, Supabase (Auth y base de datos), API de frases separada, Etapa 1 como entrega, tres escaleras, paleta en variables.css, inglés para portafolio internacional, siete pantallas de mockup. Por confirmar: que el tutor acepte Supabase (la v2.0 lo daba por cerrado; Dara lo dio como «creo»). Por definir al implementar: proveedor de frases, SQL y políticas exactas, mecanismo de siembra de tareas de ejemplo, tipografías finales, detalles de móvil.

<!-- Página 3 del PDF original -->

### Alcance

- MVP comprometido: landing, /about, Auth con Supabase, espacio privado con Life/Health/Activities/Learning, CRUD de tareas por usuario, marcado por día, progreso derivado, frase vía fetch con carga/error, responsive desde 320 px, deploy y PR de stage-frontend a main.

- Fuera de alcance: API propia Express/Node, MongoDB, JWT propio, notificaciones, analítica clínica, gamificación compleja.

- Recorte, en este orden: edición de nombre con lápiz, racha avanzada, pulido de popups y animaciones. Nunca se sacrifican la seguridad de datos ni el requisito de la API de frases.

### Indicadores propuestos (no son resultados)

Completar una tarea en menos de tres interacciones; tiempo para registrar una actividad; errores al editar o eliminar; comprensión de los indicadores en una prueba con 3–5 personas.

## 02 · Especificación funcional y lógica

### Rutas

- / landing pública; /about página pública; /signup y /login con Supabase Auth y Go Back [DECIDIDO].

- /life, /health, /activities, /learning: área privada. Sin sesión se redirige a login. Se restaura con supabase.auth.getSession() y onAuthStateChange [PROP].

- La seguridad de los datos depende de RLS, no de las rutas de React.

### Modelo de datos [PROP]

| Tabla | Campos clave | Notas |
|---|---|---|
| `profiles` | `id` (PK, FK `auth.users`), `display_name`, `created_at` | Editar nombre con lápiz es P2; mientras tanto el header muestra el correo. |
| `tasks` | `id`, `user_id`, `ladder` (`activities` \| `learning`), `title`, `archived_at`, `created_at` | Health no usa esta tabla. Archivar en vez de borrar. `UNIQUE(id, user_id)`. |
| `task_completions` | `id`, `user_id`, `task_id`, `completed_date` | `UNIQUE(task_id, completed_date)`. FK compuesta (`task_id`, `user_id`) hacia `tasks(id, user_id)` impide referencias cruzadas. |
| `health_checks` | `user_id`, `date`, `nutrition`, `sleep`, `movement` | PK (`user_id`, `date`): una fila por día. |
| Derivados (sin tabla) | pasos de hoy, totales, días en la escalera, racha, estado de Health | Se calculan de los registros; nunca son fuente de verdad. |

Las fechas son YYYY-MM-DD de la fecha local del navegador; evitar toISOString() sin tratar la zona horaria. La app no se limita a una zona horaria.

### Reglas de negocio

1. Cada tarea pertenece a una sola escalera (Activities o Learning) y conserva su id al renombrarse.

2. Completar registra la fecha local una sola vez por tarea y día. Desmarcar hoy revierte el conteo de hoy. Un día nuevo aparece sin marcar; los días pasados conservan su historial.

3. Contador diario de una escalera = tareas activas marcadas hoy; denominador = tareas activas de esa escalera.

4. Life: pasos de hoy = pasos de hoy de Activities + de Learning. Health no suma pasos.

5. Totales: Activities y Learning muestran su total propio; Life muestra el total de hoy y el total de la cuenta (Activities + Learning). Siempre calculados de task_completions.

6. Días en la escalera: días de calendario desde el alta, contando el primer día. No equivale a racha.

<!-- Página 4 del PDF original -->

7. Cuenta nueva: empieza con tareas de ejemplo (Activities: Gym, Read my Book, Guitar Practice; Learning: Learned something new, Studied a language, Studied music theory). Se siembran una sola vez; si la persona las archiva, no reaparecen.

8. Eliminar = archivar (archived_at): sale de las activas y conserva historial y totales. Si resulta demasiado complejo para el plazo, se borra definitivamente.

9. La interfaz soporta 0 tareas, carga, error de red, cuenta sin actividad y fallo de la API de frases.

### Health: regla B [DECIDIDO]

El estado se calcula en una función pura a partir del conteo de casillas de hoy y de ayer. No se guarda.

| Ayer | Hoy | Estado de hoy |
|---|---|---|
| Cualquiera | 3 casillas | Verde |
| Cualquiera | 1 o 2 casillas | Amarillo |
| Al menos 1 casilla (3/3 o 1–2) | 0 casillas | Amarillo |
| 0 casillas | 0 casillas | Rojo (dos días seguidos sin marcar) |
| Sin día anterior (primer día de la cuenta) | 0 casillas | Amarillo |

El semáforo siempre lleva etiqueta de texto y no depende solo del color. Los textos del mockup («You’re doing great!», «You got it, keep it up!», «Take a look at your health!») se usan como etiquetas de metas, no como evaluación médica.

### Racha [DECIDIDO]

Se evalúa por día cerrado; mientras hoy no termina se muestra la racha hasta ayer.

- 1 o más pasos en Activities o Learning: suma 1.

- Sin pasos, Health verde o amarillo y el día anterior sí tuvo pasos: se mantiene (no suma ni reinicia).

- Sin pasos y el día anterior tampoco tuvo pasos: se reinicia, aunque Health sea verde.

- Sin pasos con Health rojo: se reinicia.

### API externa de frases (obligatoria en Etapa 1)

Supabase guarda cuentas y tareas; la frase viene de otro servicio público, aparte, consumido con fetch. Es la integración third-party que exige la rúbrica.

- utils/quotesApi.ts usa fetch(), con la respuesta real tipada y transformada al tipo interno Quote. Nunca tipar una respuesta supuesta antes de verla.

- Proveedor: [ABIERTO]. Candidato sin verificar: DummyJSON (/quotes/random). Probar antes del viernes 27 desde la consola del navegador (CORS, sin claves).

- Componente visible MotivationalQuote en Life con carga, error con reintento y estado vacío. Un fallback nunca se presenta como si viniera de la API.

- Si el proveedor devuelve una lista, se puede añadir «cargar más» (buena práctica de la rúbrica). Documentar el proveedor y sus límites en el README.

- Cualquier variable VITE_ es legible desde el navegador.

### Estado, persistencia y seguridad

- Supabase PostgreSQL con consultas por usuario y RLS activada en todas las tablas personales (SELECT/INSERT/UPDATE/DELETE por propietario).

- Estado de UI con useState/Context para sesión, tareas y errores; funciones puras (utils/progress.ts) para contadores, Health y racha. localStorage no es la fuente de verdad.

- Los componentes no dependen del proveedor: los hooks (useTasks, etc.) aíslan Supabase. Activities y Learning reutilizan componentes.

<!-- Página 5 del PDF original -->

- Operaciones optimistas se revierten si el servidor falla. Prueba adversarial con dos usuarios antes del deploy.

### UX y accesibilidad

- Elementos button/a, label en formularios, foco visible, teclado, aria-live discreto, confirmación al archivar, no transmitir estado solo con color, alt en imágenes.

- Responsive desde 320 px sin scroll horizontal ni overflow: hidden. Decoración en CSS; ilustración principal como WebP optimizado.

### Casos de prueba críticos

- Completar y desmarcar el mismo día sin duplicados; cruce de medianoche; contadores de Life sincronizados con Activities y Learning.

- Todos los casos de la tabla de Health y de la regla de racha (incluidos primer día de cuenta y dos días sin pasos).

- Alta, renombrar, archivar; cuenta nueva con tareas de ejemplo; cuenta sin actividad; formulario inválido.

- Registro, login, logout, recarga con sesión, ruta privada sin sesión.

- Usuario A no puede leer, modificar ni borrar datos de B, incluidas referencias cruzadas en task_completions.

- Fallo de red de Supabase; carga/error/timeout de frases; deploy sin 404 al recargar rutas; móvil desde 320 px; build y lint limpios.

## 03 · Tecnologías y arquitectura

Se entrega solo la Etapa 1 (front-end) con Supabase como backend gestionado: Auth para usuarios y PostgreSQL para persistencia. Una segunda API externa devuelve frases con fetch(). Node.js se usa solo como herramienta de desarrollo de Vite, no como backend.

### Stack

- Vite + React + TypeScript: SPA con npm run dev, build y lint. React Router DOM: rutas públicas y privadas.

- HTML semántico + CSS por componente/Modules + Grid/Flex + normalize.css: maquetación mobile-first.

- variables.css: sistema de color existente; verificar contraste de estados.

- @supabase/supabase-js: Auth, sesión y consultas a PostgreSQL con RLS.

- Fetch API en utils/quotesApi.ts, tipada, con carga/error/reintento. Lucide para iconos.

- Git + GitHub + GitHub Projects: repo público, ramas main / stage-frontend / feature/*, commits descriptivos y PR a main.

- Vercel o Netlify: hosting con rewrite para SPA; configurar las URLs permitidas de Auth en Supabase y las variables públicas.

### Arquitectura

React (UI, routing, estado) -> hooks -> cliente Supabase -> Supabase Auth + PostgreSQL/RLS React (MotivationalQuote) -> utils/quotesApi.ts [fetch] -> API pública de frases

### Estructura sugerida del repositorio

project-adhd-ladder/ README.md .env.example AGENTS.md (reglas para Codex) public/ (favicons) src/ app/App.tsx components/{Header,Footer,Dropdown,LadderCard,TaskCard,TaskModal,MotivationalQuote}/ pages/{Landing,About,SignUp,LogIn,Life,Health,Activities,Learning}/

<!-- Página 6 del PDF original -->

context/AuthContext.tsx hooks/{useAuth,useTasks,useHealth}.ts utils/{supabaseClient,quotesApi,progress,dates}.ts types/{task,quote,profile,health}.ts config/constants.ts styles/{variables,global}.css images/ vendors/ (normalize.css, fuentes) supabase/migrations/ # SQL versionado

### Variables de entorno y secretos

- VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY (clave pública), VITE_QUOTES_API_URL si aplica.

- Nunca service_role ni claves secretas en el cliente. .env fuera de Git; .env.example con nombres y valores ficticios. Ninguna IA recibe claves.

- La protección de datos personales depende de RLS, no del secreto de la anon key.

### Assets, fuentes y rendimiento

- Las ilustraciones van en WebP; SVG para logo, plantas, chispas y flecha. Los PNG originales se quedan fuera del repo.

- Fondos, nubes y degradados en CSS. Textos, números y botones son HTML, no imágenes.

- Tipografías sugeridas: Patrick Hand (cuerpo) y Kalam (títulos), gratuitas de Google Fonts; validarlas contra el mockup. Autohospedarlas en vendors/ (por ejemplo con @fontsource) y añadir fallback de sistema (system-ui, sans-serif), no solo «cursive».

- LifeIcons.jsx pasa a .tsx con props tipadas. Faltan iconos de los mockups: Mail, Lock, Eye/EyeOff, ArrowLeft, X, ArrowUp.

- Los mockups usan «Usuario1»; la UI es en inglés y muestra el correo.

## 04 · Lista de comprobación de desarrollo y evaluación

Ninguna casilla viene marcada. La rúbrica oficial de Etapa 1 no exige Supabase ni login: son elecciones del proyecto. Sí exige una API third-party consumida con fetch desde utils/, con datos visibles y estados de carga y error.

### A · Causas de rechazo sin revisión (Etapa 1)

- [ ] PR de stage-frontend a main; se entrega la URL del PR, no la del repositorio.

- [ ] npm install y npm run dev funcionan.

- [ ] La API third-party carga datos reales visibles.

- [ ] Sitio desplegado; recargar una ruta no da 404.

- [ ] Sin errores críticos pendientes de revisiones anteriores (hoy no hay ninguna).

### B · Criterios de desempeño (4.21 puntos cada uno)

- [ ] Vite y todo el código en TypeScript (incluidos los iconos y componentes).

- [ ] npm run build sin errores TS; npm run lint sin errores.

- [ ] Carpetas separadas para componentes, estilos, imágenes, utilidades y recursos externos (fuentes, normalize.css).

- [ ] README con nombre, descripción, tecnologías y enlace al deploy.

- [ ] Responsive desde 320 px sin scroll horizontal ni overflow: hidden para ocultarlo.

- [ ] HTML semántico; layout con flex/grid; normalize o reset; fuentes bien conectadas.

- [ ] Componentes reutilizables con props tipadas.

- [ ] Al menos dos rutas con react-router-dom (/ y /about), navegación sin enlaces rotos.

- [ ] Hooks fuera de condicionales y bucles; key único que no sea el índice.

- [ ] Fetch third-party en utils/, con tipos de la respuesta, indicador de carga y mensaje de error visible.

- [ ] Claves en VITE_..., con .env.example y sin .env en el repo; sin node_modules ni build versionados.

### C · Mejores procedimientos (1.5 puntos cada uno)

<!-- Página 7 del PDF original -->

- [ ] Estado inicial tipado; tipos compartidos en módulos reutilizables.

- [ ] Paginación o «cargar más» si la API devuelve una lista larga.

- [ ] Estado vacío explícito cuando no hay resultados.

- [ ] Constantes en MAYÚSCULAS en un archivo de configuración.

- [ ] Limpiar addEventListener al desmontar.

- [ ] Formularios con placeholder, required y foco visible; elementos interactivos son button y a reales.

- [ ] Iconos SVG e imágenes optimizadas; sin archivos sobrantes de la plantilla de Vite.

### D · Recomendaciones (1 punto cada una)

- [ ] Fuente de sistema como alternativa a cada fuente propia.

- [ ] alt adecuado en imágenes.

- [ ] Estados hover y focus en botones y enlaces.

- [ ] Formato uniforme, nombres descriptivos y sin código muerto.

- [ ] Commits que describan cada cambio.

### H · QA específico del proyecto (no es exigencia literal de TripleTen)

- [ ] Supabase Auth: registro, login, logout y recuperación de sesión en URL pública; confirmación de email resuelta.

- [ ] CRUD: crear, renombrar, archivar y completar; cuenta nueva con tareas de ejemplo sembradas una sola vez.

- [ ] RLS en todas las tablas personales, probada con dos cuentas; task_completions no acepta un task_id ajeno; UNIQUE(task_id, completed_date) impide duplicados.

- [ ] Conteos de Life, Activities y Learning coherentes con la fecha local y el cambio de día.

- [ ] Health (regla B) y racha pasan todos los casos de la tabla; el semáforo tiene etiquetas de texto y no hay lenguaje de diagnóstico.

- [ ] Frase obtenida por fetch en utils/quotesApi.ts, visible en Life, con carga, error, reintento y respuesta vacía.

- [ ] Estados de Supabase: carga, cuenta sin datos, red desconectada y fallo de mutación.

- [ ] Revisión visual desde 320 px, teclado y contraste. Claves apropiadas para el frontend; sin service_role.

- [ ] npm run dev, build y lint verificados; deploy y PR reales de stage-frontend a main.

## 05 · Brief y plan de acción

### Objetivo y Definition of Done

Publicar una aplicación usable para registrar y completar pequeñas metas en Health, Activities y Learning y ver el progreso en Life. Está hecho cuando: corre con npm run dev, compila y pasa lint, todas las rutas navegan, hay cuentas y tareas reales persistidas, RLS aísla usuarios, la frase real se ve con carga/error, es responsive desde 320 px, está desplegada con recarga sin 404, el README está completo y el PR llegó antes del plazo.

### Priorización

- P0: arquitectura, Auth, RLS, CRUD, contadores, API de frases visible, /about, estados de carga/error, rutas, responsive, build/lint/deploy/PR.

- P1: fidelidad estética, semáforo de Health, racha básica, días en la escalera, confirmación al archivar.

- P2: edición de nombre con lápiz, racha avanzada, animaciones, estadísticas complejas.

### Calendario revisado (≈30 horas)

| Fecha | Horas | Trabajo | Prueba de cierre |
|---|---:|---|---|
| Dom 22 | 3 | Repo público y rama `stage-frontend`, Vite TS, carpetas, `variables.css`, normalize, fuentes con fallback, rutas, Landing y About | dev, build y lint limpios; `/` y `/about` navegan |
| Lun 23 | 3 | Proyecto Supabase, cliente y variables, `AuthContext`, signup/login/logout, sesión y rutas privadas | Registro, login, logout y recarga con sesión; ruta privada redirige |
| Mar 24 | 3 | Tablas, RLS, FK compuesta, siembra de tareas de ejemplo; pruebas con dos cuentas | A no lee ni escribe datos de B. Punto de control |
| Mié 25 | ≈7 | Header y selector de escalera; Life, Health, Activities y Learning; popups; estados vacíos; base responsive | Cuatro vistas navegables desde 320 px |
| Jue 26 | 3 | Alta, renombrar, archivar, marcar por fecha; contadores; `utils/progress.ts` con Health y racha | Persistencia real; casos de prueba de las tablas pasan |
| Vie 27 | 3 | `quotesApi.ts`, tipos, MotivationalQuote en Life; carga, error y reintento | Frase real visible; fallo simulado probado |
| Sáb 28 | ≈7 | Pulido responsive y accesibilidad, README, lint/build, deploy con rewrite SPA, URLs de Auth, prueba en producción con dos cuentas | URL pública sin 404 al recargar; PR enviado si todo pasa |
| Dom 29 | 3 | Correcciones, README final, PR si falta | PR enviado (URL del PR) |
| Lun 30 | — | Colchón para el feedback de TripleTen (revisan en menos de 24 h) | Sin funciones nuevas |

<!-- Página 8 del PDF original -->

Punto de control (martes por la noche): si Auth y RLS no funcionan, el miércoles se construye la UI con datos de ejemplo tipados dentro de useTasks y Supabase continúa el jueves. La UI nunca espera al backend.

### Riesgos por fecha

- 23/11: si Auth no funciona, resolverlo antes de construir estadísticas.

- 24/11: no omitir RLS aunque se retrasen los estilos.

- 26/11: si la racha se complica, mostrar bien el progreso diario y diferir la racha.

- 27/11: si el proveedor de frases falla o bloquea CORS, cambiar a otra API documentada; nunca texto estático.

- 28/11: congelar funciones. 29/11: solo correcciones.

### Flujo de trabajo y roles

- Dara decide, aprueba y conserva el código; Claude actúa como tech lead y revisor; ChatGPT/Codex escribe código en tareas pequeñas. Dara revisa todo antes de integrar.

- Cada tarea tiene un objetivo verificable. Ramas: feature/* → revisión del diff (build, lint, lectura) → merge a stage-frontend → PR final a main. Nada se sube a main sin autorización.

- Un solo documento de reglas (este dossier y la mini-skill v2, copiada como AGENTS.md) para que las IA no se contradigan.

- Claude puede leer repos públicos por enlace (rama, PR con sufijo .diff o archivos); no entra a repos privados ni lee tableros de GitHub Projects de forma fiable. Las tareas pendientes viven mejor en Issues o en un archivo TASKS.md del repo.

<!-- Página 9 del PDF original -->

## 06 · Validación y defensa técnica

### Dictamen

Viable como proyecto de Etapa 1 con backend gestionado por Supabase, siempre que se respete el orden de prioridades y se pruebe RLS. La Etapa 2 es opcional y no se elige; la rúbrica de Etapa 1 dice que quedarse en front-end es una entrega final válida. Supabase no sustituye el requisito de consumir una API third-party con fetch.

### Defensa del producto y de la arquitectura

Una lista convencional privilegia pendientes; ADHD Ladder resalta pasos completados, áreas de vida y avance visual, sin afirmar eficacia terapéutica. Como portafolio demuestra diseño, CRUD, estado, autenticación gestionada, seguridad por usuario, consumo de API, accesibilidad y despliegue. Supabase aporta Auth, PostgreSQL y API gestionada, pero el uso de un BaaS no garantiza protección automática: se prueba RLS.

### Riesgos

| Riesgo | Mitigación |
|---|---|
| Alcance: 8 pantallas, auth, CRUD, progreso y API en unas 30 horas | Priorizar P0; punto de control del martes; recortar P2 primero. |
| Supabase gratuito se pausa tras ≈7 días sin actividad (según su documentación; verificar) | Mantener actividad hasta la revisión o documentar en el README cómo reactivarlo. |
| Confirmación de email por defecto puede estorbar al revisor | Desactivarla para la entrega o dar credenciales de prueba en el README. |
| Errores de RLS podrían filtrar datos | Pruebas con dos cuentas, incluidas referencias cruzadas; FK compuesta. |
| CORS o disponibilidad de la API de frases | Probar el proveedor desde el navegador pronto; tener un segundo candidato. |
| Health puede sonar médico | Metas autodeclaradas, etiquetas de texto, sin diagnóstico. |
| Fechas, rachas y archivado alteran los números | Fecha local, funciones puras con casos de prueba, archivar en vez de borrar. |
| Diseño incompleto (About, popups, móvil) | Especificar en texto y construir mobile-first; no hacer mockups completos. |
| Dos IA con consejos distintos | Una sola fuente de reglas y revisión humana de cada rama. |
| Validez externa: no hay evidencia de impacto en personas usuarias | Presentar como hipótesis. |

### Decisiones

Cerradas: Etapa 1, Supabase, React/TS/Vite, tres escaleras, Life = Activities + Learning, Health regla B, reglas de racha, fecha local, tareas de ejemplo, archivar, frase en Life, inglés, flujo de trabajo con Codex y Claude. Pendientes: proveedor de frases, SQL y políticas detalladas, mecanismo de siembra, tipografías finales, texto de popups, breakpoints móviles, confirmación del tutor. No se reabren Open Library ni Express como prioridades.

### Validación pendiente (no certificada)

- [ ] Probar registro, login, logout y sesión en la URL pública.

- [ ] Comprobar RLS con dos usuarios, incluidas referencias cruzadas.

- [ ] Mostrar una frase realmente recibida por fetch y probar sus estados.

<!-- Página 10 del PDF original -->

- [ ] Compilar, lint y verificar cada ruta tras recargar.

- [ ] Revisar desde 320 px, teclado y contraste del semáforo.

- [ ] Enviar el PR de stage-frontend a main y recibir la evaluación.

Fuentes: rúbrica Etapa_1_aplicacion_front_end.pdf, rúbrica de Etapa 2 (referencia, no elegida), mockups 01–07, paleta y variables.css, mini-skill v2, conversaciones del 20 al 22 de noviembre. No se inspeccionó código de GitHub ni infraestructura desplegada, porque aún no existen.

## 07 · Histórico de decisiones

Reconstruido a partir de los chats y archivos del proyecto; no es una transcripción completa. Fechas por día.

19–21 de noviembre

- [CONTEXTO] Proyecto final de TripleTen con plazo el 30/11. Etapa 1 (front-end con API externa) obligatoria; Etapa 2 (backend propio) opcional.

- [DECIDIDO] Concepto: seguimiento cotidiano con la metáfora de una escalera. Proyecto en inglés para portafolio. Estilo minimalista, orgánico y acogedor; paleta oficial (verde #005C3C, crema #FDF2E5, naranja #FF891C) en PDF y variables.css.

- [DECIDIDO] Se trabajó pantalla por pantalla: mockups de Landing, Sign Up, Log In, Life, Health, Activities y Learning. Fondos y figuras en CSS; la escalera con personaje como imagen optimizada; textos y cifras en HTML.

- [CORRECCIÓN] El primer dossier proponía persistencia local y Open Library; se retiró. Supabase gestiona cuentas y datos, y una API aparte entrega frases motivacionales. Etapa 1 sin Express ni MongoDB. Se añadió RLS como obligación de seguridad.

22 de noviembre

- [DECIDIDO] Revisión del dossier v2.0: conflictos entre documentos resueltos (Life no suma Health; Health como tabla propia por fecha; racha).

- [DECIDIDO] Horas disponibles: ≈3 h en días laborales y ≈7 h el miércoles 25 y el sábado 28. Se vuelve al orden Auth y RLS primero, con punto de control el martes y alternativa de UI con datos de ejemplo.

- [DECIDIDO] Cuentas nuevas con tareas de ejemplo; fecha local del navegador; archivar si no es demasiado complejo; encabezado con el correo (lápiz para editar nombre, P2); About solo con texto; totales de Life y de cada página como se describe arriba.

- [DECIDIDO] Health regla B y reglas de racha (sección 02).

- [DECIDIDO] Flujo de trabajo: Dara decide; Claude revisa; Codex/ChatGPT escribe código; revisión antes de integrar.

- [ABIERTO] Confirmar Supabase con el tutor por escrito; proveedor de frases; confirmación de email y pausa del plan gratuito.

- Aún no existen repositorio, proyecto Supabase ni código: este historial registra decisiones, no funciones construidas.
