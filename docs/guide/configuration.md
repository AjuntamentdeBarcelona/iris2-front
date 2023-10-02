# Configuración y construcción

La SPA lee su configuración de un fichero json, que se genera dentro de la carpeta static durante la construcción fijando las variables de entorno. Esta sustitución se hace en el [entrypoint.sh](../../docker/entrypoint.sh), utilizando como base el fichero config.template.json.

Las variables de entorno que se aceptan actualmente son:

```json
{
  "API_BASE_URL": "${API_BASE_URL}",
  "CLIENT_ID_HEADER": "${CLIENT_ID_HEADER}",
  "VERSION": "${VERSION}",
  "ISSUE_COLLECTOR_ENABLED": "${ISSUE_COLLECTOR_ENABLED}",
  "ISSUE_COLLECTOR_URL": "${ISSUE_COLLECTOR_URL}",
  "ENV": "${CONFIG_ENTORN}"
}
```

Las variables del entorno de desarrollo se pueden encontrar en [src/static/config.json](../../src/static/config.json).

Añadir una nueva variable de entorno consiste en añadirla al [config.template.json](../../config.template.json) y al [src/static/config.json](../../src/static/config.json) de desarrollo. Las variables envueltas en `${NOMBRE_VAR_ENTORNO}` se sustituirán por la variable de entorno.
