---
name: ciber-security
description: >-
  Revisa y refuerza la seguridad de aplicaciones web de forma proporcional al
  cambio autorizado; realiza una auditoría integral cuando el usuario la solicite.
---

# ciber-security

## Alcance y coordinación

Sigue `AGENTS.md` para el flujo operativo, las autorizaciones y la selección de skills. El dossier define los contratos de producto y arquitectura. Architect Mode coordina la metodología y ub-mode aporta técnicas de implementación. Esta skill no autoriza rediseños, nuevas dependencias, operaciones Git, cambios de esquema, migraciones, acciones destructivas, cambios de producción ni rotación de credenciales.

- Desarrollo normal: revisa únicamente los riesgos del cambio solicitado y aplica controles compatibles dentro del alcance autorizado.
- Auditoría explícita: revisa todos los controles aplicables, preferentemente en modo lectura. Distingue hallazgos, propuestas y correcciones autorizadas. No confundas una solicitud de auditoría con autorización para ejecutar cambios disruptivos.
- Clasifica cada control como aplicable, no aplicable o pendiente de verificar. Si falta información material o permisos, informa y solicita decisión para esa parte.
- Conserva mecanismos existentes que cumplan su función. No añadas servicios, infraestructura o capas de seguridad redundantes.

## Controles de seguridad

### Identidad y acceso
- Verifica autenticación, expiración y recuperación de sesión, enlaces de recuperación de uso limitado y permisos mínimos.
- Comprueba autorización real en servidor o base de datos para cada recurso, incluidos accesos administrativos y referencias cruzadas (IDOR/BOLA). No confíes en ocultar elementos de UI.
- Si se usa un proveedor gestionado, verifica su configuración; no implementes autenticación ni hashing paralelo. Si se gestionan contraseñas propias, usa hashing adaptativo adecuado y bibliotecas mantenidas.
- Protege cookies de sesión con atributos adecuados cuando se utilicen; evalúa CSRF según el mecanismo de autenticación y envío automático de credenciales.

### Datos y aplicación
- Valida entradas no confiables en límites de confianza y aplica restricciones de integridad y autorización en servidor/base de datos. Usa consultas parametrizadas donde corresponda.
- Prevén XSS mediante renderizado seguro y sanitización cuando sea necesaria; evita insertar HTML no confiable.
- Limita peticiones y abuso en endpoints pertinentes, sin bloquear flujos legítimos; restringe CORS donde aplique. CORS no reemplaza autorización.
- Limita tipo, tamaño y permisos de archivos subidos si existe esa función. Verifica precios y pagos en servidor si existen.
- Comprueba HTTPS, cabeceras de seguridad y configuración de producción; prueba compatibilidad antes de endurecer políticas como CSP. Evita depuración y errores que expongan información sensible.

### Secretos, infraestructura y dependencias
- Mantén secretos y claves privilegiadas fuera del navegador, repositorio, logs y reportes. Distingue configuración pública y claves publishable diseñadas para el cliente de credenciales privadas.
- Revisa variables de entorno, archivos públicos y posibles secretos en Git sin reproducir sus valores. Si detectas exposición, informa y propone contención y rotación coordinada; no revoques claves ni reescribas historial por iniciativa propia.
- Revisa dependencias vulnerables según uso, impacto y compatibilidad. Propón actualizaciones fuera de alcance; no apliques upgrades masivos. Delega limpieza de paquetes no usados a ub-mode y respeta consumidores existentes.
- Evalúa registros de actividad sospechosa con mínima exposición de datos; no añadas vigilancia ni servicios innecesarios.

## Verificación e informe

- Usa pruebas autorizadas y no destructivas, preferentemente en entorno local o de pruebas con datos de prueba. Comprueba aislamiento de usuarios y controles aplicables sin acceder a datos reales ajenos.
- Clasifica hallazgos por gravedad e impacto, indicando evidencia sin secretos, ubicación, recomendación y estado (corregido, pendiente, no aplicable o no verificado).
- Reporta cambios y pruebas realmente ejecutadas, limitaciones y riesgos pendientes. No declares la aplicación invulnerable ni controles verificados sin evidencia.
- Ante una vulnerabilidad grave fuera de alcance, informa de inmediato y propone contención; detén la parte afectada si continuar supone riesgo material, sin ampliar silenciosamente la tarea.
