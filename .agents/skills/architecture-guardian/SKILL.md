---
name: architecture-guardian
description: >-
  Planifica, implementa y revisa cambios de ADHD Ladder en componentes/hooks
  reutilizables, reglas de progreso, estado, autenticación, routing,
  concurrencia, APIs, persistencia, SQL y seguridad. Ajusta el análisis
  al alcance real de cada tarea y al dossier integral v2.2.
---

# Architecture Guardian

Sigue la precedencia de `AGENTS.md`: instrucción explícita más reciente del propietario > reglas `[DECIDIDO]` del `docs/dossier.md` v2.2 > plan de trabajo > propuestas `[PROP]`. **No decidas unilateralmente puntos `[ABIERTO]`.** Lee las secciones pertinentes, no todo el proyecto indiscriminadamente. El trabajo local no subido puede ser más reciente que GitHub.

## Coordinación y no regresión

Esta skill conserva la metodología vigente de ADHD Ladder. `ub-mode` aporta técnicas de implementación y verificación; `ciber-security` aporta controles de seguridad generales. Ninguna sustituye AGENTS.md, el dossier ni el plan autorizado. No presupongas que otra skill se ha cargado: consulta sus instrucciones cuando corresponda y estén disponibles.

La incorporación de skills no constituye una tarea de refactorización, auditoría integral ni cambio de arquitectura. Conserva contratos, tecnologías, diseño y comportamiento aprobados; limita los cambios al objetivo solicitado y sus dependencias necesarias. Reporta hallazgos fuera de alcance como recomendaciones separadas. Ante un riesgo material, detén únicamente la parte afectada y solicita decisión. Respeta las fases, roles y permisos del flujo existente. Si falta una fuente necesaria para decidir, no supongas su contenido.

Las invariantes siguientes corresponden al dossier v2.2 y se conservan como referencia operativa; verifica la versión aprobada vigente antes de tocar el dominio. Si existe discrepancia, aplica la precedencia indicada arriba y reporta la desactualización, sin modificar el dossier por iniciativa propia.

## Antes de implementar

1. Define el comportamiento aprobado y sus criterios de aceptación; identifica archivos y consumidores afectados.
2. Identifica quién posee el estado o recurso (vista, proveedor compartido, hook de datos, backend). Distingue estado visual transitorio, datos persistidos y valores derivados.
3. Revisa código actual, módulos reutilizables y operaciones existentes antes de introducir otra abstracción o dependencia.
4. Revisa efectos, concurrencia, RLS y mutaciones destructivas cuando el cambio lo amerite. Para cambios visuales pequeños, limítate a sus componentes y estilos.
5. Si un requisito contradice una regla posterior aprobada o existe una decisión abierta material, detén únicamente esa parte y reporta el conflicto; no inventes la solución.

**Ejemplo de Auth:** SignUp y LogIn pueden compartir un formulario, pero `getSession()` y `onAuthStateChange` no son necesariamente operaciones redundantes: comprueba los eventos y lecturas reales antes de consolidarlas. Coordina escrituras y carreras de sesión en el `AuthProvider`, no con bloqueos locales independientes.

## Límites entre capas

- **UI:** presentación, formularios y accesibilidad; importa los estilos que utiliza, sin dependencia accidental del CSS de otras páginas.
- **Estado:** borradores y menús locales en la vista correspondiente; recursos compartidos por usuario/escala en el estado o hook compartido adecuado. Evita Context nuevos salvo necesidad concreta.
- **Datos:** Supabase y APIs externas se consultan desde hooks/utilidades tipados; jamás directamente desde un componente visual.
- **Dominio:** funciones puras para fechas, progreso, Health y rachas. No guardar derivados como verdad adicional.
- **Seguridad:** AuthProvider restaura sesión; ProtectedRoute controla navegación; Supabase RLS controla acceso real. Las mutaciones deben pertenecer al usuario autenticado.

## Invariantes de progreso v2.2 — revisar en todo cambio relacionado

La fuente de verdad son las **completaciones por tarea, usuario y fecha local**, no los contadores ni las tarjetas visibles.

```text
activitiesToday = completaciones válidas Activities con completed_date === todayLocalDate
learningToday   = completaciones válidas Learning   con completed_date === todayLocalDate
lifeToday       = activitiesToday + learningToday

activitiesTotal = completaciones válidas Activities con completed_date < todayLocalDate
learningTotal   = completaciones válidas Learning   con completed_date < todayLocalDate
lifeTotal       = activitiesTotal + learningTotal
```

- El día en curso **nunca** se incorpora a `Your total steps`. Un check/uncheck modifica hoy, **no** el histórico.
- Una tarea se marca una sola vez por fecha local. No usar UTC crudo para construir `YYYY-MM-DD`; todas las páginas comparten la misma fecha de referencia.
- Cambiar de fecha cambia la clasificación de registros, **no** los mueve, borra o duplica; no exigir cron a medianoche ni aplicación permanentemente abierta.
- Life suma los valores de Activities y Learning; Health no aporta pasos y su SectionCard muestra un círculo de estado.
- Aplica el dossier §02.6 como fuente normativa. Retirar una tarjeta la archiva mediante `archived_at` y elimina únicamente su completación de hoy. Un renombrado efectivo conserva identidad, cuenta y escalera, y elimina únicamente la completación de hoy. Un nombre normalizado equivalente conserva la marca.
- Al persistir un retiro o un renombrado efectivo, confirma o revierte juntos el cambio de la tarjeta y la eliminación de su completación de hoy. Preserva los días cerrados y la contribución histórica de las tareas archivadas. Revisa claves foráneas, `ON DELETE`, RLS y filtros de tareas archivadas para preservar el historial.
- Si hay un denominador de avance diario, corresponde al número de tareas activas; **nunca** es el total histórico.
- Health: tres metas diarias independientes con regla B calculada (ver dossier); racha basada en **días cerrados** y pasos/Health, no en `lifeTotal` ni en cambios de tarjetas.
- Máximo cuatro tareas activas por Activities y Learning. Ocultar Delete Card con una sola tarea activa, conforme a la regla de la UI.

### Casos de prueba imprescindibles para progreso

- Marcar una tarea: +1 hoy, histórico intacto; desmarcar: −1 hoy, histórico intacto; doble marcado: no duplica.
- Activities 0 y Learning 3 implican Life 3 (no Life 1).
- Lunes histórico Activities 8 / Learning 12; lunes Learning marca 3: Life hoy 3, Life total 20. Martes: hoy 0, Activities total 8, Learning total 15, Life total 23.
- Recargar o volver días después no debe sumar doble, perder completaciones ni requerir un evento de medianoche.
- Cuentas separadas no comparten pasos; renombrar o retirar una tarea no altera pasos de días cerrados.
- Health no agrega pasos; al cambiar de día se inicia sin checks, pero no necesariamente en rojo; racha se verifica separadamente.

## Estado compartido, asincronía y lifecycle

El alcance de cualquier coordinación debe coincidir con el del recurso que protege. Inspecciona concurrencia, cambios de ruta/cuenta, respuestas fuera de orden, desmontaje, carga y errores. Elige el mecanismo mínimo que resuelva el riesgo real: invalidación, descarte de respuestas obsoletas, cancelación, serialización o bloqueo en la capa propietaria. Limpia subscriptions y listeners; revierte mutaciones optimistas fallidas.

- `getSession()` y la suscripción auth (`INITIAL_SESSION` y cambios posteriores) pueden complementarse: comprobar antes de refactorizar.
- Life/Activities/Learning pueden necesitar una fuente compartida de tareas y completaciones por usuario/fecha; evitar consultas duplicadas innecesarias y resultados de la cuenta anterior.
- Health usa datos propios (`health_checks`), aunque intervenga en rachas.
- La renovación del token no implica por sí sola recargar todas las tareas.
- DummyJSON permanece como proveedor externo mediante `fetch()` en `quotesApi.ts`. Mantén la validación y los estados de carga, error, vacío y reintento. Sigue DEC-07-03 del dossier §02.10 para la persistencia aprobada por cuenta y fecha local, reservada a 07-08 y sus dependencias autorizadas.

## Seguridad y persistencia

Conserva aquí los requisitos específicos de ADHD Ladder; utiliza `ciber-security` para la revisión general proporcional al riesgo.

- RLS en todas las tablas personales; probar con dos cuentas que ninguna lee, actualiza, crea referencias cruzadas ni borra datos ajenos.
- Cumplir unicidad `(task_id, completed_date)` y protección de referencias usuario-tarea. Verificar políticas y claves foráneas antes de modificar migraciones.
- **No ejecutar** migraciones, operaciones destructivas ni cambios de esquema sin aprobación. Una modificación documental no implica que SQL ya se haya actualizado.
- No introducir contadores históricos almacenados ni cambiar una relación para salvar una implementación provisional sin justificarlo y obtener autorización.
- No filtrar secretos; `VITE_` solo para configuración pública del navegador.

## Cambios visuales y rendimiento

Conservar mockups, tokens, ilustraciones y comportamiento responsive existente. Distingue similitud estética de duplicación real. No toques páginas vecinas para ajustar un popup o CSS de una sola vista. Antes de memoizar (`useMemo`, `useCallback`, `React.memo`) o introducir librerías, identifica el problema, su alcance y beneficio observable.

## Limpieza de código y dependencias

Aplica la metodología de `ub-mode` sin ampliar el alcance ni imponer métricas como obligación de rediseño.

**No confundas código muerto con código futuro aprobado.** Revisa referencias, imports, clases CSS, puntos de entrada y consumidores reales, incluidos usos dinámicos. Elimina código muerto verificado **solo dentro del alcance** y después de comprobar regresiones. Ante consumidores inciertos, informa; ante refactors amplios, crea una recomendación en vez de ampliar silenciosamente la tarea.

## Verificación y prioridades

Revisa el diff, archivos afectados, reutilización y corrección. Ejecuta checks adecuados a la tarea; para carreras, reproduce el orden de eventos relevante. Reporta las pruebas realmente ejecutadas, sus resultados y las verificaciones pendientes o no disponibles. No declares una garantía de no regresión sin evidencia.

- **P0:** filtración de datos, pérdida de historial, duplicación de pasos, contadores con hoy dentro del total, mutaciones que mezclan usuarios u otros defectos que impiden el MVP.
- **P1:** funcionalidad, accesibilidad y casos de negocio requeridos en la tarea correspondiente.
- **P2:** pulido y optimizaciones no necesarios para la entrega.

No crear ramas, commits, push, merges ni modificar `main` sin aprobación del propietario. Terminar indicando archivos tocados, resultados y asuntos abiertos.
