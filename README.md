# ADHD Ladder

Aplicación web para organizar hábitos y tareas en pasos pequeños y visualizar el progreso. Proyecto final de desarrollo web de TripleTen, Etapa 1, y proyecto de portafolio frontend. Tras iniciar sesión puedes abrir Life, marcar tareas en Activities y Learning, registrar objetivos en Health y revelar una frase del día.

Los cambios de tareas y Health se mantienen al navegar por el área privada. Se reinician al recargar o salir de esa sesión.

## Stack

Vite, React, TypeScript y React Router en modo declarativo. Supabase Auth gestiona las sesiones. Los estilos usan CSS, Normalize.css y fuentes locales empaquetadas por Fontsource. ESLint revisa el código y Prettier aplica el formato compartido.

## Instalación y ejecución

Usa Node.js 24.x con npm. Esta es la versión mayor elegida para el proyecto y es compatible con Vite, ESLint y React Router. La versión utilizada para verificar la instalación es Node.js 24.15.0. Ejecuta los comandos desde la raíz del repositorio. npm instala el workspace de `client/` usando el lockfile de la raíz.

```sh
npm install
npm run dev
```

- `npm run build` comprueba los tipos y genera la versión de producción en `client/dist/`.
- `npm run lint` revisa el código con ESLint.
- `npm run format` aplica el formato y `npm run format:check` lo verifica.

## Frase diaria de Life

Life consulta el [endpoint de frases aleatorias de DummyJSON](https://dummyjson.com/quotes/random) mediante `fetch()` al pulsar **Click to reveal**. La [documentación de DummyJSON](https://dummyjson.com/docs/quotes) describe los campos `id`, `quote` y `author`. El navegador realiza la consulta sin claves ni datos de cuenta.

La frase revelada se conserva durante el día local al navegar. La aplicación evita frases reveladas en los seis días anteriores mediante un máximo de cinco solicitudes por intento y permite reintentar manualmente. El historial se guarda solo en memoria durante la sesión privada y se reinicia al recargar, cerrar sesión o cambiar de cuenta.

## Configuración de Supabase para desarrollo

1. Crea un proyecto en el [panel de Supabase](https://supabase.com/dashboard).
2. Abre **Connect** en el proyecto y copia la URL del proyecto y la clave **Publishable**. También puedes encontrar la clave en **Settings → API Keys**.
3. Copia `client/.env.example` como `client/.env.local`. Reemplaza los valores de ejemplo de `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY` con los de tu proyecto. Usa solo la clave publicable, ya que Vite expone las variables `VITE_` al navegador.
4. Ejecuta `npm run dev`. Si Vite ya estaba en ejecución, reinícialo para que lea `client/.env.local`.

## Formato en VS Code

Con la extensión Prettier - Code formatter, ejecuta **Format Document With...** y selecciona **Prettier**. Puedes elegirlo como formateador predeterminado para TypeScript y TSX. La extensión usa la versión local instalada con `npm install` y lee la configuración de `client/.prettierrc`.

## Tipografía

Durante la maquetación, usa `var(--font-body)` con Patrick Hand 400 para el texto de cuerpo y `var(--font-heading)` con Kalam 400 o 700 para los títulos según los mockups. Ambas familias incluyen una alternativa del sistema. Las páginas temporales conservan la tipografía del sistema.

## Pendientes de la Etapa 1

- Publicar la aplicación y registrar aquí su URL.
- Conectar la persistencia de tareas y Health y verificar el aislamiento por cuenta.
