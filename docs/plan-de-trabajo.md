# ADHD Ladder — Plan de trabajo v2.1

> Transcripción estructurada del PDF original; las decisiones y fechas se preservan tal como aparecen en la versión 2.1.

ADHD LADDER · PLAN DE TRABAJO Versión 2.1 · 22 de noviembre de 2026 · Etapa 1 con Supabase · Plazo: 30/11/2026

## Resumen

- Meta: PR de stage-frontend a main enviado el sábado 28 o domingo 29. TripleTen revisa en menos de 24 horas; el lunes 30 queda de colchón.

- Tiempo: ≈30 horas (3 h en días laborales; Mié 25 y Sáb 28 ≈7 h). Hoy no existen repo, proyecto Supabase ni código.

- Orden: Auth y RLS primero. Punto de control el martes por la noche: si fallan, el miércoles la UI usa datos de ejemplo tipados y Supabase sigue el jueves.

- Fuente de reglas: dossier v2.1 y mini-skill v2 (copiada como AGENTS.md en el repo).

## Tareas por día (cada una con objetivo verificable)

### Domingo 22 · 3 h · Cimientos

- [ ] Crear repo público project-adhd-ladder con README mínimo, .gitignore y .env.example; tablero de GitHub Projects o Issues con tareas de una sesión.

- [ ] Rama stage-frontend; proyecto Vite + React + TS; borrar restos de la plantilla; carpetas (components, pages, styles, images, utils, vendors, types, hooks, context, config).

- [ ] variables.css, normalize.css y fuentes autohospedadas con fallback de sistema; React Router con / , /about y rutas privadas vacías.

- [ ] Landing y About (si falta tiempo, About pasa al lunes).

Cierre: npm run dev, build y lint limpios; / y /about navegan. Primera rama revisada antes de integrar.

### Lunes 23 · 3 h · Auth

- [ ] Proyecto Supabase (plan gratuito); decidir la confirmación de email; cliente en utils/supabaseClient.ts con variables VITE_.

- [ ] AuthContext; pantallas Signup y Login reales; logout; getSession y onAuthStateChange; rutas privadas con redirección.

Cierre: registro, login, logout y recarga con sesión funcionan; /life sin sesión redirige a login.

### Martes 24 · 3 h · Datos y RLS

- [ ] SQL: profiles, tasks, task_completions (UNIQUE y FK compuesta), health_checks; RLS en todas; mecanismo de siembra de tareas de ejemplo (una sola vez).

- [ ] Prueba con dos cuentas: lectura, escritura, borrado y referencias cruzadas.

Cierre: la cuenta A no ve ni toca datos de B. PUNTO DE CONTROL.

### Miércoles 25 · ≈7 h · UI

- [ ] Header con selector de escalera y logout; Life, Health, Activities y Learning con componentes tipados (TaskCard, TaskModal, Dropdown).

- [ ] Popups: selector de escalera, menú de tarjeta, modal de añadir y confirmar archivado, definidos en texto.

- [ ] Estados vacíos y de carga; base mobile-first. Con datos reales si el control se superó; si no, con datos de ejemplo en useTasks.

Cierre: las cuatro vistas navegan y se ven bien desde 320 px.

<!-- Página 2 del PDF original -->

### Jueves 26 · 3 h · Funcionalidad

- [ ] Alta, renombrar, archivar y marcar por fecha; contadores diarios y totales; días en la escalera.

- [ ] utils/progress.ts con Health regla B y racha como funciones puras, con casos de prueba.

Cierre: persistencia real entre sesiones; los casos de las tablas de Health y racha pasan.

### Viernes 27 · 3 h · Frases

- [ ] Verificar el proveedor desde el navegador (CORS, sin clave); utils/quotesApi.ts con tipos; MotivationalQuote en Life.

- [ ] Carga, error con reintento y estado vacío; el fallback nunca se presenta como si viniera de la API.

Cierre: frase real visible en producción local; fallo simulado probado.

### Sábado 28 · ≈7 h · Calidad y deploy

- [ ] Responsive 320+ pulido, accesibilidad (teclado, foco, aria-live, contraste), README completo.

- [ ] Deploy en Vercel o Netlify con rewrite SPA; URLs permitidas de Auth en Supabase; prueba en producción con dos cuentas.

- [ ] npm run build y lint limpios; checklist de la rúbrica; enviar el PR si todo pasa.

Cierre: URL pública sin 404 al recargar; PR enviado.

### Domingo 29 · 3 h · Entrega

- [ ] Correcciones finales, verificación del checklist y envío del PR si no se envió (se entrega la URL del PR, no del repo).

Cierre: PR enviado. Lunes 30: colchón para el feedback, sin funciones nuevas.

## Si falta tiempo, se recorta en este orden

- Edición de nombre con lápiz; racha avanzada; pulido de popups y animaciones; estadísticas extra.

- Nunca se sacrifican: seguridad de datos (RLS), API de frases visible con fetch, /about, build y lint, deploy sin 404 y PR.

## Flujo de revisión antes de integrar

- Trabajar en una rama feature/* → subirla → compartir el enlace de la rama o del PR (con .diff) con Claude y ChatGPT → corregir → Dara integra a stage-frontend.

- Revisión mínima por tarea: npm run build, npm run lint, lectura del diff, ningún secreto, componentes sin dependencia directa de Supabase.

- Claude puede leer repos públicos por enlace; no entra a repos privados. Si no hay enlace, pegar el resultado de git diff.

- Nada se sube a main sin autorización de Dara.

## Pendientes antes de empezar

- [ ] Escribir al tutor para confirmar por escrito que Supabase es aceptable.

- [ ] Decidir si la confirmación de email estará desactivada y el plan para la pausa del plan gratuito.

- [ ] Probar el proveedor de frases desde el navegador (candidato sin verificar: DummyJSON).

- [ ] Redactar en texto el contenido de los popups y de los breakpoints móviles; texto de About con un párrafo sobre la autora.

## Mensaje de arranque para ChatGPT / Codex

Contexto: proyecto ADHD Ladder (Etapa 1 de TripleTen) con React + TypeScript + Vite, React Router, Supabase (Auth + PostgreSQL con RLS) y una API externa de frases vía fetch. Reglas: lee el dossier v2.1 y la mini-skill v2 y no las contradigas. Trabaja en tareas pequeñas con objetivo verificable, en ramas feature/*. No uses claves privadas ni toques .env. Los componentes no dependen directamente de Supabase (usa hooks). Health y racha son funciones puras en utils/progress.ts. Nada va a main sin aprobación de Dara. Tarea de hoy: (pegar aquí la tarea del día).
