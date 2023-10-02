# Introducción

El backoffice de IRIS2 está implementado utilizando el framework frontend [Vue.js](https://vuejs.org) y el constructor [Nuxt](https://nuxtjs.org). Nuxt añade a Vue algunas capas que facilitan la construcción y la implementación de SPAs, implementando todos los básicos como el enrutado o la gestión de stores Vuex de forma sencilla y natural.

Además de Nuxt y Vue, se aplica la librería bootstrap-vue, que implementa los componentes más cómunes a toda interfaz con framework css Bootstrap (v4).

## Estructura de módulos

Para entender el proyecto, es importante tener comprensión tanto de Vue como de Nuxt, que especifica una estructura de directorios para organizar los componentes. Dicha estructura puede ser [consultada en detalle en su web](https://nuxtjs.org/docs/2.x/directory-structure/nuxt).

Aplicada a IRIS tenemos la siguiente organización:

- `Assets`: ficheros css, sass y javascript que son utilizador por la aplicación. En general en assets tenemos todo lo que no son ni componentes Vue ni mixins.
- `Components`: componentes Vue de la aplicación, en esta carpeta está el core de IRIS. Entraremos en el detalle de algunos submodulos muy relevantes para introducirlos (tienen su propia sección para profundizar):
  - `pages`: Componentes base para implementar CRUDs y acciones, son el corazón de IRIS2 pues constituyen un framework interno para implementar las diferentes paǵinas. [Ver más](#iris-framework)
  - `form-components`: campos customizados para el sistema de formularios. [Ver más](./forms.md)
  - `tables`: extensiones del sistema de tablas y tipos de columnas. [Ver más](./tables.md)
  - `layout`: navegaciones, logos, headers y otros elementos del layout de la página.
  - `iris-pages`: componentes especificos de iris usando los componentes de pages. [Ver más](./iris.md)
- `Pages`: páginas de la SPA, son accedidas a través de las urls de la aplicación y son el segundo punto en cargar (primero los layouts). Se encargan de instancia o de heredar y configurar los componentes base.
- `Layouts`: conforman un layout repetible entre páginas, el layout se comparte entre varias pantallas y mientras no cambie solo carga una vez.
- `Stores`: Vuex stores de la aplicación. Conviene destacar:
  - `masters.js`: controla la carga de las tablas maestras.
  - `create.js`: controla el flujo de creación de fichas.
  - `profile.js`: controla la carga de datos de sesión del usuario.
  - [Ver más](./stores.md)
- `Lang`: traducciones, actualmente solo en catalán.
- `Static`: Datos estáticos como imágenes que no necesitan transformación.
- `Plugins`: código que se ejecuta al iniciar la SPA. [Ver más](./plugins.md)

Dentro de la documentación de cada módulo relevante de la aplicación explicaremos donde están ubicadas las implementaciones más importantes de cada uno.

## IRIS Framework

Dentro del módulo de componentes `components/pages` encontramos la implementación del framework para dashboard administrativos de iris. Básicamente son componentes y utilidades para implementar rápidamente formularios y tablas, además de permisos y flujos de acción más complejas.

Es decir, este paquete implementa unas abstracciones reutilizables que se aprovechan para implementar todos los patrones de IRIS2, es por eso que merece una mención aparte de la estructura general.

Aquellos componentes que han requerido flujos más complejos o que se escapaban de la base han sido implementados dentro de `components/iris-pages` extendiendo los componentes base.

Las abstracciones con las que trabajamos son:

- [Formularios, campos y schemas](./forms.md)
- [Listas y tablas](./tables.md)
- [Acciones](./actions.md)
- [Permisos](./auth.md)

Estos componentes combinados han permitido crear la interfaz de IRIS. Por ejemplo, desde una tabla de fichas se puede entrar al detalle de una ficha sobre la cual podemos realizar acciones, dichas acciones a su vez pueden requerir de la introducción de datos por un formulario que se enviará al servidor checkeando si es posible realizar la acción y las consecuencias que eso tiene.

Los conceptos descritos se alinean con la aproximación de REST, donde tenemos recursos sobre los que podemos hacer cinco operaciones básicas: listar, recuperar uno, actualizar (PATCH, PUT), crear y eliminar y donde podemos añadir acciones personalizadas sobre el recurso a partir de extensiones sobre su URI.

En los casos más complejos como las fichas, cuyas acciones dependen no solo de los permisos, sino de su propio estado, se introduce junto con los datos de la ficha los metadatos de las acciones que pueden realizar los usuarios sobre ella. Por ejemplo, consultamos el json al recuperar una ficha veremos algo de este estilo:


```javascript
"actions": {
  "add-message": {
    "action_url": "/services/iris/api/communications/conversations/messages/add/",
    "check_url": null,
    "can_perform": true,
    "action_method": "post"
  },
  "add-comment": {
    "action_url": "/services/iris/api/record_cards/record_cards/add-comment/",
    "check_url": null,
    "can_perform": true,
    "action_method": "post"
  },
  "reasign": {
    "action_url": "/services/iris/api/record_cards/record_cards/reasign/",
    "check_url": null,
    "reason": "La fitxa 974VMPK no es pot reassignar fora de l'àmbit perquè s'ha sobrepassat el periode per fer-ho. Per a reassignar-la fora de l'àmbit, s'ha de cancelar la fitxa per caducitat.",
    "can_perform": true,
    "action_method": "post",
    "has_permission": true
  }
  // OTRAS ACCIONES
}
```

De esta forma el sistema puede generar y mostrar partes de la interfaz de forma sencilla. En la sección de [acciones](./actions.md) se detalla qué significa cada campo de este formato.

## ¿Dónde empiezo a trabajar?

Antes de empezar a revisar código, recomendamos que hayas leído y comprendido las secciones relacionadas con el framework de IRIS, ya que es el lenguaje y conceptos en los que está expresado IRIS. Una vez comprendidos, la barrera de entrada es más baja y se reduce a revisar algunos detalles de implementación de ciertos componentes.

Si es la primera vez que visitas el código de IRIS lo más recomendable es que empieces a trabajar desde las páginas, ya que son el punto de entrada y es fácil relacionarlas con lo que ves en pantalla. A partir de ahí, sirven como ejemplo para ver como están implementados sus patrones.

Lo ideal es partir de los [cruds sencillos](../../src/pages/backoffice/admin/records/applicant-types/), para acabar en las pantallas de [detalle](../../src/pages/backoffice/records/_id.vue) y [creación](../../src/pages/backoffice/create/index.vue) de fichas, que son las más complejas.

La propia documentación de IRIS2 ya está estructurada para explicar primero el framework y después pasar a los detalles más relevantes de su uso para implementar la lógica de negocio.

Esta documentación tiene como objetivo servir como índice, los componentes se documentan en su propio fichero .vue para después ser ampliados en contextopor estas páginas.

## Siguientes pasos

[TABLAS Y LISTADOS](./tables.md)