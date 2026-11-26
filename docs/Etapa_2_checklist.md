# Etapa 2. Aplicación full stack

Fuente: `Etapa_2_aplicacion_full_stack.pdf` (TripleTen, 4 páginas).

Transcripción con formato Markdown e identificadores de seguimiento añadidos. Casillas sin marcar: no constituyen una auditoría. En la primera sección las casillas representan motivos de denegación, no criterios positivos.

## Criterios para denegar la revisión del proyecto

- [ ] E2-D01 — No se envió el pull request desde `stage-fullstack` a `main`, o el enlace lleva al repositorio y no al pull request.
- [ ] E2-D02 — El servidor no arranca con `npm run dev` una vez instaladas las dependencias.
- [ ] E2-D03 — La API no registra usuarios nuevos con datos válidos, o no permite iniciar sesión.
- [ ] E2-D04 — Falta alguna de las tres piezas desplegadas: el front-end, la API o la base de datos.
- [ ] E2-D05 — No se corrigieron los errores críticos señalados en una revisión anterior.

## Criterios de desempeño

Cada punto de esta sección vale 3.2 puntos.

- [ ] E2-C01 — El servidor vive en la carpeta `server`, está escrito en TypeScript y tiene su propio `package.json`, `tsconfig.json` y `eslint.config.js`.
- [ ] E2-C02 — Los scripts del servidor cubren el desarrollo con recarga, la compilación y el arranque de la versión compilada; el proyecto compila y pasa el linter sin errores.
- [ ] E2-C03 — La dirección de la base, el puerto, la clave del JWT y el origen del front-end se leen de variables de entorno. Hay un `.env.example` con esas claves y el `.env` no está en el repositorio.
- [ ] E2-C04 — Hay al menos dos entidades: la de usuario y otra con los datos que pertenecen a cada persona, que guarda el `_id` de su dueño en un campo obligatorio.
- [ ] E2-C05 — El esquema de usuario tiene un email único y obligatorio, y la contraseña se guarda hasheada, nunca tal cual.
- [ ] E2-C06 — Ninguna respuesta de la API devuelve la contraseña ni su hash.
- [ ] E2-C07 — `POST /signup` crea la cuenta y `POST /signin` devuelve un JWT; ninguna de las dos exige autorización.
- [ ] E2-C08 — Hay rutas para obtener el perfil de quien tiene la sesión abierta y para pedir, crear y eliminar sus datos.
- [ ] E2-C09 — Todas las rutas, salvo el registro y el inicio de sesión, están protegidas por un middleware que comprueba el JWT y responde 401 si falta o no es válido.
- [ ] E2-C10 — La API devuelve solo los registros de quien hace la petición, y nadie puede eliminar los de otra persona: el controlador comprueba la propiedad y responde 403.
- [ ] E2-C11 — Las rutas están organizadas en archivos separados por recurso.
- [ ] E2-C12 — Los datos que llegan en el cuerpo se validan antes de tocar la base: los campos obligatorios se comprueban en el controlador y el esquema valida el resto.
- [ ] E2-C13 — El manejo de errores está centralizado en un middleware, y ninguna respuesta devuelve la traza ni el error original de la base de datos.
- [ ] E2-C14 — Los códigos de estado corresponden a lo ocurrido (400, 401, 403, 404, 409, 500), y el registro y el inicio de sesión tienen un limitador que responde 429 al superarse.
- [ ] E2-C15 — El front-end habla con tu API a través de una dirección que sale de `VITE_API_URL` y no está escrita en el código.
- [ ] E2-C16 — Hay formularios de registro e inicio de sesión, en ventana modal o en páginas propias, y los errores que devuelve el servidor se muestran en la interfaz.
- [ ] E2-C17 — El token se guarda en `localStorage` y viaja en el encabezado `Authorization`, leyéndose en el momento de cada petición.
- [ ] E2-C18 — Al abrir la aplicación con un token guardado, la sesión se recupera con una petición a tu API; si el token ya no sirve, se borra.
- [ ] E2-C19 — Los datos de la persona viven en una variable de estado global creada con `createContext()` e insertada en App a través de `CurrentUserContext.Provider`.
- [ ] E2-C20 — El encabezado se ve distinto según haya sesión o no, y al cerrar sesión se borra el token y la persona vuelve a la parte pública.
- [ ] E2-C21 — Existe la página con los datos propios y su ruta está protegida: quien no inició sesión y la abre con un enlace directo es redirigido al formulario de inicio de sesión.
- [ ] E2-C22 — Desde la interfaz se pueden crear y eliminar los registros propios, y la lista refleja el cambio sin recargar la página.
- [ ] E2-C23 — La base de datos está en un clúster de MongoDB Atlas, con su usuario y su contraseña.
- [ ] E2-C24 — El front-end y la API están desplegados, son accesibles por sus direcciones públicas y el `README.md` las incluye.
- [ ] E2-C25 — Desde la dirección pública funcionan el registro, el inicio de sesión y las acciones sobre los datos propios: CORS está configurado con el origen real del front-end desplegado.

## Mejores procedimientos

Cada punto de esta sección vale 1.25 puntos.

- [ ] E2-M01 — La contraseña tiene una longitud mínima comprobada en el servidor.
- [ ] E2-M02 — El JWT caduca y su payload contiene solo el identificador de la persona.
- [ ] E2-M03 — El servidor confía en el proxy de la plataforma con `trust proxy`, para que el limitador distinga una dirección de otra.
- [ ] E2-M04 — La conexión de Mongoose limita el grupo de conexiones con `maxPoolSize`.
- [ ] E2-M05 — Hay una ruta de estado que responde siempre lo mismo, sin depender de la base ni del token.
- [ ] E2-M06 — Hay un manejador para las rutas que no existen, que responde 404 con un mensaje claro.
- [ ] E2-M07 — El manejo de errores vive en su propio módulo y no dentro de `app.ts`.
- [ ] E2-M08 — Las rutas de cada recurso se conectan desde un archivo índice, y `app.ts` queda corto y legible.
- [ ] E2-M09 — Los mensajes de error y las constantes de la aplicación viven en un archivo aparte.
- [ ] E2-M10 — Mientras se espera la respuesta de tu API, la interfaz muestra un estado de carga.
- [ ] E2-M11 — Las respuestas de tu API están tipadas en el front-end.
- [ ] E2-M12 — El repositorio tiene un `package.json` en la raíz con los comandos para instalar y levantar las dos partes.

## Recomendaciones

Cada punto de esta sección vale 1.67 puntos.

- [ ] E2-R01 — Tras cada acción la interfaz avisa de lo que ocurrió, no solo cuando algo falla.
- [ ] E2-R02 — El código está formateado de forma uniforme, con nombres descriptivos y sin código muerto ni comentado.
- [ ] E2-R03 — Los mensajes de los commits describen lo que hace cada cambio.
