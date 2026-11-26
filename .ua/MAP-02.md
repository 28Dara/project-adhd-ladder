# MAP-02 · Portabilidad y revisión del mapa

**Dictamen #Guardian.** La base existente sirve para incorporar colaboradores y consultar dependencias. La publicación del mapa y los cambios de organización quedan para decisión de la propietaria. La guía y este informe son los únicos artefactos nuevos de MAP-02.

La revisión leyó el checkout local `stage-frontend` en `c0305f7536efee2cc1c65aa61621f419c797a6c7`. El hash del grafo coincide con HEAD y se resolvió como commit. Los diffs del proyecto, el índice y los archivos no rastreados fuera de `.ua/` estaban vacíos. Se conservan 97 archivos analizados, 399 nodos, 895 relaciones, 203 funciones y callbacks, siete capas y ocho pasos. La evidencia de validación oficial, el `SKIP` y las pruebas del visor procede de MAP-01B y de la revisión de puertos anterior.

## Inventario exacto

Tamaños lógicos medidos antes de escribir los dos documentos de MAP-02. **Base** indica qué usa la herramienta para retomar el análisis. La portabilidad corresponde al contenido y presupone una versión compatible de Understand Anything y acceso al checkout cuando se quiere abrir el código.

| Ruta | Bytes | Uso | Visor | Base incremental | Ciclo y portabilidad | Git propuesto |
| --- | ---: | --- | --- | --- | --- | --- |
| `.ua/.understandignore` | 366 | Reglas del inventario y excepciones para archivos de configuración | — | Conserva el alcance | Persistente, portable | Sí |
| `.ua/code-lessons.json` | 29 788 | 28 lecciones detalladas y 69 resúmenes | Opcional, panel de lecciones | Opcional, se conserva o regenera según el plan | Derivado, portable | Local |
| `.ua/config.json` | 44 | Español y actualización automática desactivada | Opcional, preferencias | Política de ejecución | Persistente, portable | Sí |
| `.ua/fingerprints.json` | 70 217 | Huellas, símbolos e imports por archivo | — | Base estructural | Derivado persistente, portable para el commit y versión compatibles | Sí |
| `.ua/intermediate/incremental-plan.json` | 386 | Salida de la comprobación `SKIP` | — | Entrada temporal del finalizador durante el intento | Temporal y regenerable, de valor local | Ignorar |
| `.ua/intermediate/scan-result.json` | 28 047 | Inventario y mapa de imports previos | — | Caché persistente recomendada | Derivado, portable pero regenerable | Caché local |
| `.ua/knowledge-graph.json` | 412 765 | Relaciones, capas, símbolos y tour | Requerido | Grafo anterior | Persistente y portable | Sí |
| `.ua/launch-dashboard.cmd` | 300 | Arranque local de Vite para el visor | Opcional, entrada recomendada aquí | — | Persistente, específico de Windows e instalación | Local |
| `.ua/MAP-01.md` | 9 759 | Evidencia del análisis inicial | — | — | Informe histórico, portable | Local |
| `.ua/MAP-01B.md` | 4 003 | Evidencia de instalación, validación y comandos locales | — | — | Informe histórico con rutas personales | Local |
| `.ua/meta.json` | 159 | Commit, fecha, versión y recuento del análisis | Opcional, metadatos | Identifica el punto de partida | Persistente, portable | Sí |
| **Total previo** | **555 834** | **11 archivos** | | | | |

`.ua/tmp/` estaba vacío y `.ua/intermediate/` contenía dos archivos. El visor oficial requiere el grafo y trata la configuración, metadatos y lecciones como recursos auxiliares. El reconciliador puede recuperar los caminos de inventario desde el grafo y las huellas si falta el escaneo anterior. En ese caso recalcula las entradas de imports que falten en la caché. Conserva el escaneo local para evitar ese trabajo en el equipo habitual.

Artefactos nuevos y portables, recomendados para Git. `.ua/ONBOARDING.md` ocupa 8265 bytes y sirve de guía de incorporación. `.ua/MAP-02.md` ocupa 17141 bytes y registra la revisión y propuesta. Ambos son documentos persistentes. El total final de `.ua/` es de 13 archivos y 581240 bytes lógicos.

La clasificación se cotejó con la versión instalada 2.9.8 en `packages/viewer/README.md`, `packages/dashboard/vite.config.ts`, `packages/core/src/persistence/index.ts` y `skills/understand/{SKILL.md,prepare-incremental.mjs,finalize-incremental.mjs}`.

## Seguridad y portabilidad

| Hallazgo | Evidencia y propuesta |
| --- | --- |
| Credenciales y tokens | Revisión estática de los 11 archivos con patrones de claves privadas, JWT, tokens de proveedores, tokens literales de visor, URLs con credenciales, correos y nombres de variables sensibles. Cero coincidencias de esos tipos. El grafo y las lecciones mencionan nombres de configuración pública, sin valores detectados. Se revisaron artefactos, no archivos privados ni el historial completo de Git. |
| Perfil local identificable | `launch-dashboard.cmd` contiene una ruta absoluta bajo un perfil de Windows. `MAP-01B.md` contiene tres rutas bajo el mismo perfil, incluida una ubicación sincronizada. Excluir ambos del índice y de cualquier paquete de contexto. Si se autoriza mejorar el lanzador, resolver la instalación con una variable local como `UA_DASHBOARD_DIR` y validar su directorio antes de arrancar. |
| Duplicación de texto | `scan-result.json` guarda en `readmeHead` los primeros 3 000 caracteres exactos del README, 3 045 bytes con los saltos originales. Es la copia literal relevante. Las lecciones también repiten parte de los resúmenes del grafo. Mantener ambas cachés localmente. |
| Alcance del mapa | Grafo y huellas contienen nombres de archivos, símbolos, imports, contratos y relaciones estructurales. El grafo contiene descripciones y rangos. Revisar nuevamente el contenido y la autorización al compartir una versión futura. |

### Dashboard local

| Proceso | Puerto |
| --- | ---: |
| ADHD Ladder frontend | 5173 |
| Express | 3000 |
| Understand Anything | 5174 |

El lanzador local `.ua/launch-dashboard.cmd` ejecuta la ruta oficial de Vite del visor con `--host 127.0.0.1 --port 5174 --strictPort --no-open`. `GRAPH_DIR` se calcula desde la ubicación del lanzador y las variables quedan en el proceso local por `setlocal`. Conserva la protección por token del middleware oficial y carece de un token fijo. Los scripts npm de ADHD Ladder son independientes. Para futuras sesiones en este equipo, el punto de entrada es `.\.ua\launch-dashboard.cmd`. El comando directo `$understand-dashboard` conserva **5173** como puerto predeterminado y su comportamiento normal si está ocupado.

El lanzador es reutilizable en esta instalación. Su ruta absoluta limita el traslado a otro perfil o equipo, por lo que se propone mantenerlo local hasta aprobar un cambio. En sistemas distintos de Windows, la alternativa oficial del checkout usa su paquete `packages/dashboard`, `GRAPH_DIR` apuntando a la raíz del proyecto y `pnpm exec vite --host 127.0.0.1 --port 5174 --strictPort --no-open`. La revisión actual fue estática. Las pruebas previas confirmaron coexistencia, HTTP 200 con token y 403 ante ausencia o error de token.

## Tamaño y organización del repositorio

| Conjunto | Archivos | Bytes lógicos |
| --- | ---: | ---: |
| Archivos rastreados en el árbol actual | 404 | 14 053 930 |
| Directorio local `.git/`, objetos y metadatos | 1 492 | 14 164 609 |
| Skills rastreadas | 289 | 4 471 284 |
| Impeccable | 69 | 2 318 052 |
| Modern Web Guidance | 212 | 2 100 814 |
| Architect Mode, Architecture Guardian, UB Mode y Ciber Security | 8 | 52 418 |
| Arquitectura y operación, incluidos README, AGENTS, Architect, dossier y plan | 5 | 147 476 |
| Documentación académica local | 3 | 35 797 |
| Diseño, paleta y mockups | 10 | 8 027 582 |
| `revision-05B.diff` | 1 | 24 002 |
| `client/src/types/profile.ts` | 1 | 0 |
| `node_modules/` y `client/node_modules/` | 10 559 | 180 057 990 |
| `client/dist/` existente | 13 | 1 623 297 |
| `dist/` raíz existente | 13 | 1 621 426 |
| `server/dist/` existente | 4 | 3 067 |

- **Git.** Los tamaños del árbol actual y de `.git/` se midieron por separado. `git count-objects -v` informó 1 423 objetos sueltos y tres empaquetados. Retirar archivos del índice reduce el contenido rastreado de futuros checkouts. Los blobs existentes siguen en el historial. Los tamaños son lógicos y la medida local excluyó enlaces simbólicos.
- **Bundle.** En la salida frontend existente, JS y CSS suman 554 234 bytes, o 155 917 bytes al comprimir cada archivo con gzip para estimar transferencia. Los otros recursos gráficos y fuentes suman 1 068 602 bytes. La configuración vigente compila los workspaces y las skills, documentos y `.ua/` quedan fuera de sus entradas. Las cifras corresponden a artefactos locales existentes y la medición no identifica qué salida se publicó.
- **Almacenamiento local.** Las dependencias ya están ignoradas. La copia raíz de `dist/` y `.ua/tmp/` son candidatos locales si se confirma que carecen de consumidores. Hay siete carpetas vacías bajo `client/src/`: `assets`, `components/Dropdown`, `components/LadderCard`, `components/MotivationalQuote`, `components/TaskModal`, `pages/Activities` y `pages/Learning`. No ocupan entradas de Git. `profile.ts` sigue siendo un candidato sin importadores estáticos en el mapa y su retiro requiere revisión separada.
- **Contexto de IA.** Las skills de terceros ya quedan fuera del escaneo del grafo. La reducción de contexto proviene de cargar solo la sección pertinente y consultar nodos por ID. El tamaño en disco carece de equivalencia directa con tokens. No se midieron tokens.

**Skills reutilizables.** Impeccable y Modern Web Guidance suman **281 archivos y 4 418 866 bytes** en el árbol. Una instalación global versionada reduce la duplicación entre proyectos. Antes de retirarlas del índice, confirmar la paridad de sus referencias y el acceso de cada colaborador. `AGENTS.md` enlaza guías locales de ambas y `skills-lock.json` fija procedencia y commit de Modern Web Guidance. La ruta global equivalente y la paridad de Impeccable quedan sin verificar. Los cuatro conjuntos propios, las fuentes académicas, las decisiones aprobadas y su metodología deben conservarse.

**Diff histórico.** `revision-05B.diff` está en el índice desde el commit `37c5360`. Su tamaño es menor frente a diseño y skills. Mantenerlo hasta confirmar que el commit y la documentación preservan la evidencia necesaria. Cualquier retiro futuro es una operación separada del índice.

## Qué compartir

| Destino | Conjunto recomendado |
| --- | --- |
| Git | `.ua/knowledge-graph.json`, `.ua/fingerprints.json`, `.ua/meta.json`, `.ua/config.json`, `.ua/.understandignore`, `.ua/ONBOARDING.md` y `.ua/MAP-02.md`. Versionar juntos el grafo, las huellas y los metadatos cuando se publique una nueva base para actualizarla desde otro clon. |
| Fuentes de ChatGPT, con autorización futura | `.ua/ONBOARDING.md` y `.ua/knowledge-graph.json`. El hash del grafo informa la revisión de referencia. Para aceptar un cambio, aportar la sección pertinente del dossier y del archivo real cuando la tarea lo requiera. |
| Exclusivamente local | Lanzador, MAP-01 y MAP-01B, caché del escaneo y lecciones opcionales. Las huellas y la configuración sirven al flujo local o del repositorio, y el paquete de solo consulta prescinde de ellas. |
| Temporales o regenerables | Planes intermedios, parches de huellas, entradas y salidas de lotes, `.ua/tmp/` y directorios oficiales de descarte. |

El mínimo de solo visualización es el grafo. Para retomar análisis incremental desde otro clon, usar grafo, huellas y metadatos del mismo commit, además de la política y exclusiones acordadas. El proceso local puede regenerar el escaneo. Con solo el grafo, la skill considera ausente la base incremental y puede iniciar un análisis completo.

## Flujo incremental y metodología

1. **Antes de implementar.** Comprueba rama, hash analizado, HEAD y diferencias de código dentro del proyecto. Lee los nodos de entrada, sus consumidores directos y las reglas del dossier que correspondan. Para cambios aislados y triviales, basta leer el archivo y sus consumidores evidentes. Usa `$understand-diff` si cambia estado compartido, un contrato, rutas, una API o varios consumidores.
2. **Después de implementar.** Verifica funcionalidad y contratos afectados. Con la aceptación de la propietaria, ella hace el commit. Ejecuta `$understand --no-auto-update` con la base coherente de la rama. Sigue los resultados oficiales `SKIP`, `PARTIAL_UPDATE`, `ARCHITECTURE_UPDATE` o `FULL_UPDATE`. Conserva `autoUpdate=false` y limita `--full` a una base incompatible o ausente cuando el flujo oficial lo requiera.
3. **Archivos nuevos, editados, eliminados y renombrados.** Deja que el reconciliador compare el commit base y HEAD. Para altas comprueba cobertura e imports. Para ediciones comprueba símbolos conservados y consumidores. Para bajas comprueba nodos, referencias y anclas retiradas. Para renombres revisa la ruta anterior, la nueva y los imports de sus consumidores. Un cambio de tipo o contrato compartido requiere revisar ambos extremos de cada relación relevante aunque un consumidor conserve su texto.
4. **Rama distinta o metadatos obsoletos.** Resuelve el hash del grafo, compáralo con HEAD y revisa el diff del proyecto. Un commit con cambios solo en artefactos generados puede conservar la última base de código. Si la rama diverge, usa una base coherente para esa rama o evalúa el alcance real antes de aplicar el plan. Si faltan huellas o metadatos, verifica la correspondencia con el commit original y usa el procedimiento oficial de la versión instalada. Evita cambiar hashes manualmente.
5. **Cambios sin commit.** Consulta el grafo como foto de su commit, con el diff local y los archivos actuales como suplemento. El reconciliador oficial rechaza cambios relevantes sin commit. Espera el commit aprobado de la propietaria. El test de actualización con cambios reales sigue pendiente para la primera tarea legítima que lo justifique.

| Skill | Momento de uso |
| --- | --- |
| `$understand` | Crear una base cuando se necesita o reconciliar cambios aprobados. |
| `$understand-chat` | Resolver una pregunta concreta sobre dependencias, rutas o datos consultando pocos nodos. |
| `$understand-explain` | Profundizar en un archivo, función o módulo. |
| `$understand-diff` | Evaluar impacto, consumidores y riesgos de un diff significativo. |
| `$understand-onboard` | Preparar incorporación o actualizar la guía tras un cambio arquitectónico. |
| `$understand-domain` | Explorar flujos y reglas del producto cuando la vista de código resulte insuficiente. |
| `$understand-dashboard` | Inspeccionar gráficamente. En este equipo, usar el lanzador de 5174. |

Propuesta documental posterior a la aprobación: una línea de selección en [AGENTS.md](../AGENTS.md) que remita a esta tabla, un enlace a la [guía](ONBOARDING.md) desde el README y una referencia breve en [docs/Architect.md](../docs/Architect.md) que mantenga responsabilidades. Architect Mode planifica, decide con la propietaria, orienta aprendizaje y revisa evidencia. Understand Anything aporta conocimiento e impacto. UB Mode preserva simplicidad y detecta duplicación semántica. Ciber Security revisa los límites de confianza. El dossier y las rúbricas conservan sus responsabilidades normativas.

## Cambio exacto propuesto para el próximo commit aprobado

1. Incorporar los siete artefactos portables indicados en la fila Git de «Qué compartir».
2. Añadir a la raíz las siguientes reglas puntuales de `.gitignore`. Las reglas existentes ya cubren dependencias, builds y entornos privados.

```gitignore
# Estado local de Understand Anything
/.ua/intermediate/
/.ua/tmp/
/.ua/.trash-*/
/.ua/code-lessons.json
/.ua/launch-dashboard.cmd
/.ua/MAP-01.md
/.ua/MAP-01B.md
```

3. Revisar el índice por rutas y validar el esquema, los enlaces y las reglas de exclusión. El commit puede dejar el grafo anclado al commit de código que describe. Como `.gitignore` estaba inventariado, confirmar su efecto con el reconciliador después del commit y guardar la nueva evidencia que corresponda. Mensaje propuesto `docs(knowledge): version portable architecture map`.

En este corte, los once artefactos iniciales de `.ua/` están fuera del índice. Para una futura migración de skills o del diff ya rastreados, las reglas candidatas son `/.agents/skills/impeccable/`, `/.agents/skills/modern-web-guidance/` y `/revision-05B.diff`. Revisar por separado las referencias, la procedencia y la preservación histórica antes de aprobar un retiro del índice para esas rutas. Añadir reglas de ignore por sí solo carece de efecto sobre esos 282 archivos ya rastreados.

**Límites.** El grafo es estático y resume solo el commit citado. Las migraciones SQL y la seguridad efectiva de Etapa 2 siguen pendientes de verificación autorizada. La revisión de portabilidad y patrones de secretos cubre el contenido actual de los artefactos. El visor, la red y el flujo incremental con cambios reales quedaron fuera de las pruebas de MAP-02. La decisión sobre el commit, la publicación y cualquier traslado queda en revisión de la propietaria.
