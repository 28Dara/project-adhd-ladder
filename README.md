# ADHD Ladder

Aplicación web para organizar hábitos y tareas en pasos pequeños y visualizar el progreso. Proyecto final de desarrollo web de TripleTen, Etapa 1. La base actual incluye las páginas públicas de inicio y acerca del proyecto.

## Stack

Vite, React, TypeScript y React Router en modo declarativo. Los estilos usan CSS, Normalize.css y fuentes locales empaquetadas por Fontsource. ESLint revisa el código y Prettier aplica el formato compartido.

## Instalación y ejecución

Usa Node.js 24.x con npm. Esta es la versión mayor elegida para el proyecto y es compatible con Vite, ESLint y React Router. La versión utilizada para verificar la instalación es Node.js 24.15.0.

```sh
npm ci
npm run dev
```

- `npm run build` comprueba los tipos y genera la versión de producción.
- `npm run lint` revisa el código con ESLint.
- `npm run format` aplica el formato y `npm run format:check` lo verifica.

## Formato en VS Code

Con la extensión Prettier - Code formatter, ejecuta **Format Document With...** y selecciona **Prettier**. Puedes elegirlo como formateador predeterminado para TypeScript y TSX. La extensión usa la versión local instalada con `npm ci` y lee la configuración de `.prettierrc`.

## Tipografía

Durante la maquetación, usa `var(--font-body)` con Patrick Hand 400 para el texto de cuerpo y `var(--font-heading)` con Kalam 400 o 700 para los títulos según los mockups. Ambas familias incluyen una alternativa del sistema. Las páginas temporales conservan la tipografía del sistema.

## Pendientes de la Etapa 1

- URL de producción.
- Configuración de Supabase.
