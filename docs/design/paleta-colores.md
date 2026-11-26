# ADHD Ladder — Paleta de color v1.1

> Conversión de `ADHD-Ladder-Paleta-v1.pdf`. Referencia de producción: 20 de noviembre de 2026. Las muestras gráficas están representadas por sus valores HEX. El archivo `client/src/styles/variables.css` es la fuente de verdad para implementar los colores.

Identidad orgánica, acogedora y minimalista: verdes naturales, fondos crema y beige, acentos naranja y tonos pastel. Esta guía conserva los valores propuestos en el chat.

## 01 · Identidad

| Nombre | Variable CSS | HEX | Uso |
|---|---|---|---|
| Forest Green | `--color-primary` | `#005C3C` | Logo, iconos y contadores de progreso. |
| Deep Green | `--color-primary-dark` | `#1A604B` | Botones principales y acciones. |
| Ladder Green | `--color-ladder` | `#296A4A` | Cara frontal de los escalones. |
| Sage Green | `--color-sage` | `#6D9670` | Laterales de los escalones y decoración. |
| Olive Green | `--color-olive` | `#7C9B46` | Tareas completadas y checkboxes. |
| Soft Sage | `--color-sage-light` | `#B5BF91` | Vegetación y detalles decorativos. |
| Step Orange | `--color-accent` | `#FF891C` | Acentos de marca, motivación y progreso. |

## 02 · Fondos y superficies

| Nombre | Variable CSS | HEX | Uso |
|---|---|---|---|
| Warm Cream | `--color-background` | `#FDF2E5` | Fondo principal de la aplicación. |
| Ivory Cream | `--color-surface` | `#FCF5EA` | Superficie de tarjetas y formularios. |
| Peach Mist | `--color-cloud` | `#F9E6D7` | Nubes y figuras del fondo. |
| Sand Beige | `--color-sand` | `#EDE2C9` | Superficie superior de los escalones. |
| Warm Border | `--color-border` | `#D9C4AA` | Bordes de tarjetas y popups. |
| Pale Olive | `--color-highlight` | `#DDDFC2` | Etiquetas de rachas, días y estadísticas. |

## 03 · Tipografía

| Nombre | Variable CSS | HEX | Uso |
|---|---|---|---|
| Charcoal | `--color-text` | `#263238` | Títulos y texto principal. |
| Muted Charcoal | `--color-text-secondary` | `#6B7066` | Fechas, descripciones y texto secundario. |
| Muted Green | `--color-text-muted` | `#46695E` | Texto decorativo y elementos secundarios. |
| Soft White | `--color-text-inverse` | `#FFFCF6` | Texto sobre botones verdes. |

## 04 · Colores semánticos

| Nombre | Variable CSS | HEX | Uso |
|---|---|---|---|
| Success | `--color-success` | `#A7CC83` | «You're doing great!» |
| Warning | `--color-warning` | `#FFCD40` | «You got it, keep it up!» |
| Caution | `--color-caution` | `#FF891C` | Naranja de Health «Good start, but could be better». Reutiliza `--color-accent`. |
| Danger | `--color-danger` | `#FF8985` | «Take a look at your health!» |
| Success Background | `--color-success-bg` | `#E8EDD3` | Fondo de confirmaciones. |
| Warning Background | `--color-warning-bg` | `#FFE7AD` | Fondo de advertencias. |
| Caution Background | `--color-caution-bg` | `#FFDDC2` | Fondo pastel del nivel naranja de Health. |
| Danger Background | `--color-danger-bg` | `#FAD4CC` | Fondo de errores y Delete Card. |

## 05 · Proporción de uso

- **70 %** cremas y neutros.
- **20 %** verdes.
- **7 %** textos y contrastes.
- **3 %** naranja.

Distribución orientativa, no medición exacta.

## 06 · Favicon

| Elemento | Variable CSS | HEX |
|---|---|---|
| Base | `--color-primary` | `#005C3C` |
| Escalones | `--color-sage` | `#6D9670` |
| Letras AL | `--color-surface` | `#FCF5EA` |
| Acento | `--color-accent` | `#FF891C` |

## 07 · Variables CSS

Centralizar los colores en `variables.css` y utilizar `var(--color-primary)` y las demás variables en los componentes.

```css
:root {
  /* 01 / Identidad */
  --color-primary: #005C3C;
  --color-primary-dark: #1A604B;
  --color-ladder: #296A4A;
  --color-sage: #6D9670;
  --color-olive: #7C9B46;
  --color-sage-light: #B5BF91;
  --color-accent: #FF891C;

  /* 02 / Fondos y superficies */
  --color-background: #FDF2E5;
  --color-surface: #FCF5EA;
  --color-cloud: #F9E6D7;
  --color-sand: #EDE2C9;
  --color-border: #D9C4AA;
  --color-highlight: #DDDFC2;

  /* 03 / Tipografía */
  --color-text: #263238;
  --color-text-secondary: #6B7066;
  --color-text-muted: #46695E;
  --color-text-inverse: #FFFCF6;

  /* 04 / Colores semánticos */
  --color-success: #A7CC83;
  --color-warning: #FFCD40;
  --color-caution: var(--color-accent);
  --color-danger: #FF8985;
  --color-success-bg: #E8EDD3;
  --color-warning-bg: #FFE7AD;
  --color-caution-bg: #FFDDC2;
  --color-danger-bg: #FAD4CC;
}
```

## 08 · Notas de producción

Los tonos son una normalización de las referencias visuales; algunos HEX son adaptaciones propuestas, no extracciones literales. Las descripciones de Health usan negro sobre el tono fuerte al activarse y sobre el pastel correspondiente en reposo. El borde de la descripción activa oscurece el tono para marcar el estado por grosor y contraste. Los fondos, figuras y degradados se plantean en CSS.
