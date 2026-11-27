# ADHD Ladder

ADHD Ladder es una aplicación web para organizar actividades, practicar habilidades y registrar hábitos mediante pequeñas metas diarias. Está inspirada en las dificultades de organización y constancia que pueden experimentar las personas con TDAH. Es la entrega frontend de Etapa 1 del programa Web Development de TripleTen.

## Inicio rápido

1. Clona la rama de Etapa 1 e instala las dependencias.

   ```bash
   git clone -b stage-frontend --single-branch https://github.com/28Dara/project-adhd-ladder.git
   cd project-adhd-ladder
   npm ci
   ```

2. Copia [client/.env.example](client/.env.example) como `client/.env.local` y completa los valores indicados en [Variables de entorno](#variables-de-entorno).

   ```bash
   cp client/.env.example client/.env.local
   ```

3. Arranca el cliente desde la raíz. Todo el recorrido frontend funciona con Express apagado.

   ```bash
   npm run dev:client
   ```

4. Abre la URL que imprime Vite. Normalmente es `http://localhost:5173`.

## Requisitos técnicos

- Node.js **24.x**, npm y Git.
- Acceso a internet desde el navegador para Supabase Auth y DummyJSON.
- El repositorio usa npm Workspaces. La instalación en la raíz prepara `client/` y `server/` con un solo archivo de bloqueo.

## Variables de entorno

Completa `client/.env.local` antes de iniciar Vite. La propietaria debe facilitar por separado los valores reales del proyecto Supabase habilitado para la revisión.

| Variable | Valor esperado |
| --- | --- |
| `VITE_SUPABASE_URL` | URL pública del proyecto Supabase. |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Clave publicable del mismo proyecto. |

Ambos valores son configuración pública del cliente. Usa exclusivamente la clave publicable y conserva `client/.env.local` fuera de Git. Reinicia Vite si cambias el archivo.

Express usa `HOST=127.0.0.1` y `PORT=3000` por defecto. Para ajustar su configuración local, copia [server/.env.example](server/.env.example) como `server/.env`.

## Guía de evaluación

1. **Landing.** Abre `/` en la URL de Vite. Sin sesión, verás la pantalla de bienvenida.
2. **About.** Abre **About** en el encabezado o en el pie para conocer el proyecto y su autora. Vuelve a la portada.
3. **Registro.** Pulsa **Sign up**. Introduce un correo de prueba al que tengas acceso, escribe y confirma la contraseña y pulsa **Continue**.
4. **Confirmación.** Si Supabase requiere confirmar el correo, abre el enlace que recibas antes de iniciar sesión. Si el registro inicia sesión automáticamente, llegarás a Life.
5. **Inicio de sesión.** Si aún no tienes sesión, pulsa **Log in**, introduce los datos de la cuenta que registraste y pulsa **Continue**.
6. **Life.** Revisa **Your steps today**, que suma las marcas de hoy en Activities y Learning, y **Your total steps**, que cuenta las marcas de días anteriores que están en memoria. La vista también muestra los días desde el registro y la racha de días cerrados.
7. **Activities y Learning.** Usa los enlaces de Life o el selector del encabezado para abrir **Activities Ladder** y **Learning Ladder**. Cada una tiene sus propias tarjetas.
8. **Marcar y desmarcar.** En cada escalera, alterna una casilla y observa cómo aumenta o disminuye el contador diario. Deja al menos una tarjeta marcada para comprobar el resumen.
9. **Crear.** Pulsa **+** (**Add task**), escribe un nombre y confirma con **Submit**. Se admiten hasta cuatro tarjetas activas por escalera. El botón desaparece al alcanzar el límite.
10. **Renombrar.** Abre el engrane de una tarjeta, elige **Change Name**, cambia el nombre y pulsa **Submit**. Un cambio efectivo de nombre retira la marca de hoy si la tarjeta estaba marcada.
11. **Archivar.** Abre el engrane y elige **Delete Card**. Confirma con **Delete**. La tarjeta sale de la lista activa y pierde su marca de hoy, si la tenía. Los pasos anteriores se conservan en la sesión. Siempre queda al menos una tarjeta activa.
12. **Volver al resumen.** Pulsa **Go back to the Life Ladder**. Comprueba que **Your steps today** refleja las marcas de ambas escaleras.
13. **Health.** Abre **Health Ladder** y alterna **Good Nutrition**, **Good Sleep** y **Daily Movement**. El indicador y la leyenda cambian según las metas marcadas. Health influye en la racha y aporta cero pasos.
14. **Frase real.** Vuelve a Life y pulsa **Click to reveal**. Durante la petición verás **Loading quote...**. La frase procede de `GET https://dummyjson.com/quotes/random`, una solicitud directa del navegador que puedes ver en la pestaña Red de las herramientas de desarrollo. Si aparece un error, pulsa **Retry**.
15. **Cerrar sesión.** Pulsa **Log out** y comprueba que vuelves a Landing.
16. **Rutas protegidas.** Sin sesión, abre directamente `/life`, `/activities`, `/learning` o `/health`. La aplicación redirige a `/login`. `/about` sigue siendo pública.
17. **Recarga.** Vuelve a iniciar sesión, crea una tarjeta o marca una tarea y recarga la página. Supabase Auth puede restaurar la sesión. Las tarjetas de ejemplo vuelven a su estado inicial y se pierden los cambios de la sesión.

## Funciones principales

- **Life** reúne el progreso diario e histórico, los días desde el registro, la racha y la frase motivacional bajo demanda.
- **Activities y Learning** permiten crear, marcar, renombrar y archivar tarjetas en listas independientes.
- **Health** presenta cuatro niveles de bienestar según las metas diarias y contribuye al cálculo de la racha.
- **Cuenta y navegación** incluyen registro, inicio y cierre de sesión, restauración de sesión, rutas protegidas y edición del nombre visible durante la sesión.

## Tecnologías

- **Cliente** · React, TypeScript, React Router, Vite, HTML semántico y CSS adaptable.
- **Autenticación y API externa** · Supabase Auth y Fetch API para DummyJSON.
- **Base de servidor y herramientas** · Node.js, Express, npm Workspaces, Git, ESLint y Prettier.

## Arquitectura

- [`client/`](client/) contiene la aplicación React. Las rutas públicas y privadas parten de [`App.tsx`](client/src/app/App.tsx). Las escaleras comparten el estado privado de la cuenta y Life deriva sus indicadores de ese estado. La consulta a DummyJSON vive en [`quotesApi.ts`](client/src/utils/quotesApi.ts).
- [`server/`](server/) contiene la base opcional de Express en TypeScript para Etapa 1. Expone una comprobación de disponibilidad y maneja errores de API. El estado de tareas, completaciones, Health y perfil reside en el cliente.

## Comandos de verificación técnica

Ejecuta estos comandos desde la raíz. Verifican ambos workspaces.

```bash
npm run build
npm run lint
npm run format:check
```

Para probar Express por separado, ejecuta `npm run dev:server`. Abre `http://127.0.0.1:3000/api/healthz` o usa el host y puerto que imprime el servidor. El endpoint `GET /api/healthz` devuelve HTTP 200 con `{"status":"ok"}`. `npm run dev` inicia ambos workspaces juntos.

## Limitaciones actuales y estado del proyecto

- En Etapa 1, el uso de Supabase se limita a Auth para la identidad y la autenticación. Las tareas, completaciones, registros de Health, nombre visible editable, borradores e historial de frases viven en memoria privada de la aplicación. Se reinician al recargar, cerrar sesión o cambiar de cuenta. Es una limitación deliberada de Etapa 1.
- Las [migraciones SQL históricas](supabase/migrations/) se conservan como antecedentes. El flujo actual de producto usa memoria y Express cumple la función de base de API.
- En la tutoría del 26 de noviembre de 2026, TripleTen confirmó que el proyecto podía presentarse como frontend y recomendó un backend propio a futuro. La arquitectura y la implementación de Etapa 2 están suspendidas mientras se decide una extensión y se aprueba el alcance técnico.
- El despliegue está pendiente. Si la entrega final se mantiene en la modalidad frontend, la rúbrica exige una aplicación desplegada que permita recargar sus rutas. [Criterios de Etapa 1](docs/07-AUD-cumplimiento-academico.md).

## Metodología de desarrollo y colaboración con IA

El trabajo se organizó en objetivos pequeños con criterios de aceptación, revisión técnica y validación por la propietaria. Dara definió el concepto, los mockups, la experiencia de usuario, las reglas de negocio y las decisiones de arquitectura. Codex colaboró de forma sustancial en la implementación bajo su supervisión. Dara revisó y aprobó el trabajo.

## Autora

**Dara Rangel (28Dara)** · Proyecto final del programa Web Development de TripleTen, 2026. [GitHub](https://github.com/28Dara)
