---
name: architecture-guardian
description: >-
  Planifica, implementa o revisa funcionalidades y refactorizaciones de ADHD Ladder
  que afecten componentes o hooks reutilizables, lógica, estado compartido,
  autenticación, routing, operaciones asíncronas, APIs, persistencia, acceso a datos
  o arquitectura. Ajusta la revisión al alcance del cambio.
---

# Architecture Guardian

Aplica la precedencia de `AGENTS.md`. Consulta solo las secciones pertinentes de
`docs/dossier.md` y `docs/plan-de-trabajo.md`. Respeta las decisiones aprobadas y el
alcance autorizado por el propietario. Señala las reglas ambiguas antes de
implementar una interpretación nueva.

## Antes de implementar

1. Identifica la responsabilidad, la capa que debe asumirla y los módulos que la
   consumen o podrían verse afectados.
2. Busca funciones, componentes, hooks y servicios existentes. Reutilízalos si
   resuelven la misma responsabilidad y deben evolucionar juntos.
3. Determina si el cambio afecta a una vista o a un recurso compartido. Revisa las
   dependencias y el riesgo de duplicar lecturas, lógica o estado.
4. Elige la solución más sencilla que cumpla el comportamiento aprobado. En
   cambios visuales pequeños, revisa solo los componentes relacionados. Amplía la
   revisión para Auth, routing, datos o cambios transversales según su alcance.

Distingue duplicación real, similitud visual o estructural, diferencias de dominio y
mecanismos complementarios. Por ejemplo, SignUp y LogIn comparten `AuthPage` y
Auth reutiliza `getSupabaseClient()`. `getSession()` aporta una lectura explícita y
su posible error, mientras que la suscripción de Supabase emite `INITIAL_SESSION`
y los cambios posteriores. Comprueba los efectos reales, incluidas las solicitudes
HTTP, antes de consolidar mecanismos que se parecen.

## Estado y operaciones asíncronas

**El alcance de la coordinación debe corresponder al alcance del recurso afectado.**
Conserva la visibilidad de contraseña y los mensajes de validación en el
formulario. Coordina las operaciones sobre la sesión en el proveedor compartido y
comparte datos entre vistas cuando tengan la misma fuente de verdad. Reserva
Context para estado que deba compartirse.

Revisa operaciones simultáneas, respuestas fuera de orden, navegación, desmontaje,
cambio de cuenta y fallos. Elige el mecanismo que resuelva el caso concreto
(cancelación, descarte de resultados obsoletos, serialización o bloqueo compartido)
y justifica su alcance. Limpia suscripciones al desmontar y revierte actualizaciones
optimistas si falla la mutación.

**Caso de referencia — Autenticación compartida.** Si `/signup` y `/login` coordinan sus envíos únicamente mediante estados locales, cambiar de ruta puede permitir operaciones simultáneas sobre la misma sesión. Una respuesta tardía podría sobrescribir una autenticación más reciente.

**Principio arquitectónico:** las operaciones que modifican un recurso compartido deben coordinarse en la capa responsable de ese recurso. En este caso, `AuthProvider`, utilizando un mecanismo común para ambas operaciones.

Aplica este principio a otras funcionalidades con recursos compartidos, evaluando siempre si existe un riesgo real de concurrencia antes de introducir bloqueos o mecanismos adicionales.

## Límites entre capas

- **Interfaz.** Los componentes se ocupan de presentación, accesibilidad e
  interacción. Cada módulo importa los estilos que usa o se apoya en estilos
  compartidos explícitamente. Por ejemplo, Life debe poder mostrarse sin que
  AuthPage haya cargado su CSS.
- **Estado y coordinación.** Los hooks y Context aíslan el estado compartido.
  Una vista obtiene los datos que necesita de su fuente, con independencia de
  qué otra vista se haya visitado.
- **Datos y servicios.** Los hooks y utilidades tipados encapsulan el acceso
  externo. Mantén las consultas de Supabase fuera de los componentes visuales.
- **Dominio.** Dedica funciones puras a fechas, progreso, Health y rachas.
  Calcula los derivados desde los registros persistidos.
- **Persistencia y autorización.** Supabase y PostgreSQL aplican RLS sobre datos
  personales. Los guards de React Router controlan navegación y montaje de vistas.
  Mantén el stack aprobado con Supabase como backend gestionado.

## Auth, routing y datos de ADHD Ladder

- Mantén un `AuthProvider` y usa `useAuth` para acceder a la sesión. En 03C agrupa
  las rutas privadas bajo un guard reutilizable que distinga restauración pendiente,
  error de restauración, ausencia de sesión y sesión válida. Cuando se implemente
  la redirección de usuarios autenticados desde rutas públicas de Auth, decide
  el destino en un solo lugar.
- Cuando Life, Activities y Learning necesiten las mismas tareas y completados,
  evalúa una fuente compartida por usuario. Activities y Learning comparten
  componentes y mutaciones. Health conserva sus reglas y su acceso a datos propios.
- Vincula las lecturas al usuario y a los parámetros relevantes, como la fecha.
  Descarta resultados de la cuenta anterior. Una renovación del token por sí sola
  no justifica volver a cargar las tareas.
- Life agrega Activities y Learning. Health interviene en la racha según el dossier.
  Usa el calendario local del navegador, conserva el historial al archivar y
  garantiza que las tareas de ejemplo se creen una sola vez por cuenta.
- Encapsula la API externa de frases en `quotesApi.ts` con `fetch()` y un proveedor
  aprobado. Su carga y sus errores se gestionan de forma independiente de Supabase.

Incorpora hooks, servicios o capas cuando un caso concreto los necesite. Antes de
proponer memoización (`useMemo`, `useCallback`, `React.memo`), cachés, librerías de
estado, servicios genéricos o middleware, identifica el problema y el beneficio
específico. Revisa primero consultas duplicadas, suscripciones, resultados
obsoletos, estado redundante y cálculos derivados almacenados.

## Limpieza de código y dependencias

**Distingue el código muerto del código que aún no se utiliza.** Conserva el
código con un uso futuro aprobado y documentado, aunque todavía carezca de
consumidores. Para clasificar código como muerto, verifica su alcance, sus
referencias y su uso real. Comprueba también los puntos de entrada, las API
públicas, la configuración y las referencias dinámicas, incluidas las clases CSS.

Al terminar un cambio, revisa los archivos tocados y sus dependencias directas.
Busca imports, variables, funciones y componentes sin uso, código inalcanzable,
ramas obsoletas, soluciones temporales ya sustituidas, estados redundantes y
lógica duplicada. Comprueba los consumidores de estilos aparentemente huérfanos y
de dependencias o archivos que el cambio pueda haber dejado obsoletos.

- **Código muerto comprobado.** Elimínalo durante la tarea si está dentro del
  alcance y puedes verificar que se conserva el comportamiento aprobado.
- **Consumidores inciertos.** Reporta el hallazgo y solicita revisión antes de
  eliminarlo.
- **Refactorización amplia.** Regístrala como recomendación para la tarea
  correspondiente.

Consolida lógica cuando las piezas compartan responsabilidad y la solución sea
más clara. Limita la revisión al cambio y sus dependencias directas. En la
entrega, indica qué retiraste, por qué y cómo verificaste el comportamiento, o
indica brevemente que la revisión del alcance no detectó código muerto.

## Validación y prioridad

Revisa reutilización, alcance del estado, limpieza de efectos, dependencias
accidentales y comportamiento de los consumidores relacionados. Ejecuta las
comprobaciones pertinentes. Para dar una carrera por corregida, prueba la secuencia
que la provoca, incluidas respuestas fuera de orden cuando corresponda.

- **P0 · Bloqueante.** Problema comprobado de seguridad, corrección o integridad
  del estado que impide aprobar la implementación actual.
- **P1 · Necesario en la tarea correspondiente.** Resuélvelo al implementar la
  funcionalidad relacionada.
- **P2 · Opcional.** Mejora de calidad o rendimiento que no bloquea el MVP.

Reporta los hallazgos relevantes, su prioridad y las comprobaciones realizadas.
