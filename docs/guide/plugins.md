# Plugins

En esta sección explicaremos los [plugins](https://nuxtjs.org/docs/2.x/directory-structure/plugins) implementados en IRIS para incializar y configurar algunos detalles de la SPA.

La lista de plugins activos se puede consultar en el fichero [`nuxt.config.js`](../../nuxt.config.js)

## Axios

Posiblemente el plugin más importante, configura las cabeceras que permiten la comunicación con el backend. Pone el marcha la librería axios fijando las urls base utilizadas por defecto.

Más detalles de la configuración de [nuxt-axios](https://axios.nuxtjs.org/).

## formGenerator

Registra los campos propios para el [sistema de formularios](https://github.com/vue-generators/vue-form-generator).

## i18N

Configura los componentes en función del idioma, por ejemplo fija el idioma del sistema de formularios.

## Awesome notifications

Inicializa las librerías de modales y notificaciones.

## Filters

Añade filtros Vue a la aplicación de propósito general.

## Font awesome

Registra la librería de fontawesome y su configuación.

## Próximos pasos

[NAVEGACIÓN](./navigation.md)