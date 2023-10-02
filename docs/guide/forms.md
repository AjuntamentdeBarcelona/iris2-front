# Forms

El sistema de formularios está implementado extendiendo los componentes de la librería de generación de formularios [`vue-form-generator`](https://github.com/vue-generators/vue-form-generator).

Todo el sistema de formularios se basa en definirlos en base a un schema que fija los campos, su tipo, sus validaciones y configuraciones especificas del tipo de campo. Además, permite definir su layout de forma fácil, agrupando los campos en FormSets y grupos.

Todo el sistema es extensible con campos personalizados, incluso permite la inclusión de componentes que no son campos para crear layouts y configuraciones ricas. Por ejemplo, se puede añadir un warning dentro del formulario o cualquier otro tipo de componente que muestre información.

En esta sección detallaremos como trabajar todos estos puntos del sistema de formularios con ejemplos concretos de como se aplican en IRIS2.

## Definición de formularios (Schema)

Los formularios se especifican usando la clase [`FormDefinition`](../../src/assets/js/forms/formDefinition.js), que permite trabajar los schemas y da algunas utilidades que no vienen de serie en `vue-form-generator`. Por ejemplo, es habitual necesitar hacer una copia de los campos o redefinir el tipo de alguno de ellos, para ello el FormDefinition trae métodos y utilidades.

Ejemplo: generar el formulario para editar un record type

```javascript
function getRecordTypeDefinition(vm) {
  let descriptions = SchemaUtils.getDescription(
    40,
    ['ca', 'es', 'en'],
    vm.$t('description'),
    'description',
    { placeholder: vm.$t('description') }
  )
  return new FormDefinition(
    // ESPECIFICACIÓN DE CAMPOS
    {
      ...descriptions,
      tri: {
        type: 'input',
        inputType: 'number',
        label: 'TRI',
        placeholder: 'TRI',
        styleClasses: 'col-3',
      },
      trt: {
        type: 'input',
        inputType: 'number',
        label: 'TRT',
        placeholder: 'TRT',
        styleClasses: 'col-3',
      },
    },
    // LAYOUT
    {
      fields: [],
      class: 'row',
      groups: [
        {
          legend: vm.$t('configuration'),
          fields: Object.keys(descriptions).concat(['tri', 'trt']),
        },
      ],
    }
  )
}
```

Lo primero importante a destacar es que las definiciones se dividen en dos partes, la especificación de los campos y el layout. En la especificación definimos qué son los campos y en el layout como se muestra el formulario.

En este ejemplo se introduce además una nueva clase, [`SchemaUtils`](../../src/assets/js/iris2/forms/SchemaUtils.js) que incluye algunos métodos para generar patrones cómunes en IRIS. Por ejemplo, generar descripciones en varios idiomas de forma consistente.

Podemos obtener una copia de este schema con el método `clone` y redifinir, pacial o completamente, sus campos con el método `define`:

```javascript
const copied = schema.cloned()
copied.define('tri', {label: 'NEW LABEL'}) // REDEFINIMOS SOLO EL LABEL
```

Para un layout de los campos en tabla (cada fila es un formulario), se debe usar [irisTableFormGenerator.vue](../../src/components/pages/form/irisTableFormGenerator.vue).

### Utilidades para modificar el layout

Muchas aplicaciones requieren que el layout cambie de forma dinámica en función de los valores del formulario u otro tipo de estado. Para ello, los layouts permiten poner nombre a los grupos para encontrarlos de forma fácil:

```javascript
  return new FormDefinition(
    // ESPECIFICACIÓN DE CAMPOS
    {
      tri: {
        type: 'input',
        inputType: 'number',
        label: 'TRI',
        placeholder: 'TRI',
        styleClasses: 'col-3',
      },
      trt: {
        type: 'input',
        inputType: 'number',
        label: 'TRT',
        placeholder: 'TRT',
        styleClasses: 'col-3',
      },
    },
    // LAYOUT
    {
      fields: [],
      class: 'row',
      groups: [
        {
          layout_name: 'MY_LAYOUT', // NOMBRAMOS EL LAYOUT
          legend: vm.$t('configuration'),
          fields: ['tri', 'trt'],
        },
      ],
    }
  )
}
```

Una vez nombrado el layout, podemos buscarlo desde la definición y modificarlo en función del valor que sea necesario:

```javascript
const layout = schema.getLayoutByName('MY_LAYOUT')
layout.fields = someCondition() ? ['tri', 'trt'] : ['tri'] // Ocultar o mostra el campo trt en función de someCondition
```

## Creando páginas de formularios

El componente base para usar formularios es [`schemaForm`](../../src/components/pages/form/schemaForm.vue), que dada una definición y algunas configuraciones adicionales, permite la creación de páginas que dado un formulario lo guarda en el backend. Está preparada para funcionar con el formato de errores de rest-framework y puede funcionar o bien guardando en backend o bien lanzando eventos (en función de sus props).

Ejemplo: editar un tipo de solicitante:

```javascript
export default {
  name: 'ApplicantTypesForm',
  extends: SchemaForm,
  mixins: [AdminMixin],
  layout: 'Masters',
  props: {
    url: {
      type: String,
      default: '/api/masters/applicant_types/',
    },
    successUrl: {
      type: String,
      default: 'backoffice-admin-records-applicant-types',
    },
    definition: {
      type: Function,
      default: formDefinition, // Form definido en algún punto
    },
  },
  created() {
    if (this.isNewModel) {
      this.defaultModel()
    }
  },
}
```

La forma más sencilla de personalizar el comportamiento del formulario es recurrir a la herencia, ya que la clase tiene muchos métodos estilo hook para sobreescribir durante el ciclo de vida del componente:

- **applyInitialTransformation**: modificar los datos que inicialmente se reciben del servidor, útil para objetos que tienen un formato diferente en server que en los datos que trabaja el formulario.
- **adaptSchema**: Adaptar el schema de forma dinámica en base a los datos iniciales del formulario, por ejemplo, para ajustarlo cuando editamos un objeto en función de sus datos.
- **adaptModelUpdated**: modifica los datos que serán enviados con el evento "model-updated".
- **afterUpdate**: hacer cambios en el estado después de que un campo se actualice.
- **getSaveData**: permite modificar los datos antes de mandarlos al servidor.
- **isValid**: permite verificar si el objeto es válido desde código, como complemento a las normas de validación de vue-form-generator.
- **beforeSubmit**: para realizar tareas antes del envío, el envío solo se realizará si devuelve true.
- **afterServerError**: ajustar el estado después de un error del servidor al intentar guardar-
- **afterSave**: tareas a realizar cuando el objeto se ha guardado correctamente.
- **processErrors**: procesar los errores del servidor, por defecto el schemaForm funciona con el formato de rest-framework, pero es posible que se requiera una integración con otros servicios.
- **getRequestUrl**: modificar como se construye la url a la que se guardará.
- **getExtraRequestConfig**: configuraciones adicionales para las peticiones.
- **getDefaultButtons**: modificar los botones del formulario.

Hay otros métodos que puedes sobreescribir, para ello lo mejor es familizarizarse con el código de schemaForm y ver como funciona, para poder implementar las subclases sin romper nada.

### Modificar botones del formulario

Para configurar los botones hay que sobreescribir el método getDefaultButtons, que debe devolver una lista de objetos con el formato que mostramos a continuación:

```javascript
getDefaultButtons() {
  return [
    {
      name: 'save',
      text: this.$t('form_save'),
      click: this.submit,
      icon: 'save',
      classes: 'btn-primary mr-2',
    },
    {
      name: 'exit',
      text: this.$t('form_back_without_changes'),
      click: this.goBack,
      icon: 'backward',
      classes: 'order-1 mr-auto btn-light',
    },
  ]
}
```

### Modificar los datos iniciales del formulario

[TemplateForm](../../src/components/iris-pages/templates/TemplateForm.vue)

```javascript
applyInitialTransformation(initial) {
  if (this.recordType) {
    initial.record_types = [
      {
        record_type: this.recordType.id,
        description: this.recordType.description,
      },
    ]
  }
  if (this.answerType) {
    initial.response_type = this.answerType
  }
  return initial
}
```

### Configuración extra de la petición, ejemplo con excel

[BaseReportForm.vue](../../src/components/iris-pages/reports/BaseReportForm.vue)

```javascript
getExtraRequestConfig() {
  return {
    headers: {
      Accept: 'application/xlsx',
    },
    responseType: 'blob',
  }
}
```

### Adaptar el schema en base a los datos iniciales

[CompanyForm](../../src/components/iris-pages/create/CompanyForm.vue)

Deshabilitar un campo cuando se edita, quedando editable solo en la creación.

```javascript
adaptSchema(schemaDef, initial) {
  if (this.formType === 'update') {
    schemaDef.fields.cif.disabled = true
  }
}
```

### Comportamiento complejo antes de hacer el submit

[Resolution.vue](../../src/components/iris-pages/records/process/Resolution.vue)

```javascript
beforeSubmit(model) {
  if (!this.modelHasChanges) {
    // No enviar si no hay cambios
    this.showNotReadyMessage()
    return false
  }
  // Mostrar un mensaje si la ficha será enviada a tramitación externa y no hacer submit hasta que lo confirme
  if (
    this.process.next_step_code == RecordState.EXTERNAL_PROCESSING.id &&
    !this.transitionMsgShown
  ) {
    this.showConfirmExternal()
    return false
  }
  return true
}
```

### Transformar los datos del formulario, antes de enviar al servidor

[DetailEditForm](../../src/components/iris-pages/admin/DetailEditForm.vue)

Guardado de datos más complejos en el formulario de edición de detalle.

```javascript
getSaveData(data) {
  data.features = data.features || []
  data.applications = data.applications || []
  return {
    short_description_es: data.short_description_es || '',
    short_description_ca: data.short_description_ca || '',
    short_description_en: data.short_description_en || '',
    visible: data.hide != undefined ? !data.hide : true,
    external_email: data.external_email == null ? '' : data.external_email, // NULL not allowed, send blank
    features: data.features.map(feature => {
      return {
        ...feature,
        is_mandatory: feature.is_mandatory || false,
      }
    }),
    applications: data.applications.map(application => {
      return {
        favorited: false,
        ...application,
      }
    }),
    ...this.getDerivationData(),
  }
}
```

## Edición

A partir del schemaForm se construyen algunos componentes de edición de contenido más complejos o concretos. Por ejemplo, podríamos destacar el component [`Edit`](../../src/components/pages/form/Edit.vue), que se encarga editar recursos rest. Primero, se encarga de hacer la petición del recurso y luego de presentar los datos con un schemaForm precargado con ellos y listo para lanzar la petición al endpoint correspondiente con el método `PATCH`.

Siguiendo el ejemplo anterior, el formulario de edición sería:

```javascript
import Edit from '~/components/pages/form/Edit'
import Types from './types'
import AdminMixin from '~/pages/backoffice/admin/AdminMixin'

export default {
  name: 'ApplicantTypeUpdate',
  extends: Edit,
  mixins: [AdminMixin],
  layout: 'Masters',
  props: {
    title: {
      type: String,
      default: 'Edició de tipus de sol·licitant',
    },
    url: {
      type: String,
      default: '/api/masters/applicant_types/',
    },
    successUrl: {
      type: String,
      default: 'backoffice-admin-records-applicant-types',
    },
    method: {
      type: String,
      default: 'put',
    },
    formComponent: {
      type: [Object, String],
      default: () => Types,
    },
  },
}
```

### Editar con un listado

Este es un patrón muy concreto de las pantallas de edición temáticas, muestra el formulario para editar el área o el elemento y debajo sus listados de elementos o detalles. Sencillamente se trabaja añadiendo una propiedad de lista.

[Update area (pages/backoffice/admin/records/theme/area/_id.vue)](../../src/pages/backoffice/admin/records/theme/area/_id.vue)

```javascript
import EditWithSublist from '~/components/pages/form/EditWithSublist.vue'
import AreaForm from './area.vue'
import ElementList from '../element/index.vue'
import AdminMixin from '~/pages/backoffice/admin/AdminMixin.js'

export default {
  name: 'AreaUpdate',
  components: {
    ElementList: ElementList,
    AreaForm: AreaForm,
  },
  extends: EditWithSublist,
  mixins: [AdminMixin],
  props: {
    url: {
      type: String,
      default: '/api/theme/areas/',
    },
    relatedFilterAttrName: {
      type: String,
      default: 'area_id',
    },
    title: {
      type: String,
      default: "Edició d'àrea",
    },
    formComponent: {
      type: [Object, String],
      default: () => AreaForm,
    },
    // AQUÍ SE DEFINEN LOS LISTADOS QUE HABRÁ DEBAJO DEL FORMULARIO 
    listComponents: {
      type: Array,
      default: () => ['ElementList'],
    },
    successUrl: {
      type: String,
      required: false,
      default: 'backoffice-admin-records-theme',
    },
  },
}
```

### Editar con schema inferido de los datos del servidor

[EditInferrerdchema.vue](../../src/components/pages/form/EditInferredSchema.vue) se basa en ajustar el schema con los datos obtenidos del servidor antes de realizar la carga. Para ello, se debe extender el componente y sobrescribir el método `getInferredSchema(instance)` para generar el schema deseado.

El mejor ejemplo de EditInferrerdchema es la página de [configuración](src/components/iris-pages/admin/ConfigurationEdit.vue):

```javascript
getInferredSchema(configurations) {
  const uidField = 'id'
  const schemas = {}
  configurations.results.forEach(config => {
    schemas[config[uidField]] = {
      fields: [
        {
          ...this.getConfigSchema(config),
          model: 'valor',
          label: 'Valor',
          styleClasses: 'value',
        },
        {
          type: 'textArea',
          model: 'description',
          label: 'Descripció',
          help: config.original_description || '',
          styleClasses: 'description',
          rows: 3,
        },
      ],
    }
  })
  return new FormDefinition(
    {
      results: {
        type: 'multiform',
        multischema: schemas,
        inlineIdName: uidField,
        draggable: false,
        labelField: 'name',
        canDelete: false,
        styleClasses: 'col-12 configuration',
        hideGroupErrors: true,
      },
    },
    {
      groups: [{ fields: ['results'] }],
    }
  )
}
```

## Formularios avanzados

El sistema de formularios divide cada formulario en los siguientes conceptos o niveles:

- Formulario
  - FormSet (introducido por IRIS): combina varios campos aplicando lógica para ello.
    - FormGroup: wrapper del campo, concepto de bootstrap para incluir errores y campos.
      - Field: campo en si mismo.

En este sección definirimos los tipos de FormSets y los tipos de campos que ha implementado IRIS para su interfaz.

### FormSets

Ubicados en la carpeta [src/components/form-generator/layout](../../src/components/form-generator/layout), encontramos los siguientes:

- [FormFieldset](../../src/components/form-generator/layout/FormFieldset.vue): se utiliza por defecto en todos los grupos del layout de IRIS. No tiene más funcionalidad que mostrar campos.
- [TabbedFieldset](../../src/components/form-generator/layout/TabbedFieldset.vue): muestra los grupos de valores clasificados en pestañas. Ejemplo representativo: [DetailEditForm](../../src/components/iris-pages/admin/DetailEditForm.vue).
- [OneOfFieldset](../../src/components/form-generator/layout/OneOfFieldset.vue): muestra N grupos de formularios en pestañas, pero solo cuenta el valor de los campos de la pestaña activa. Ejemplo [editar feature](../../src/pages/backoffice/admin/records/attributes/add.vue)
- [WizzardFieldset](../../src/components/form-generator/layout/WizzardFieldset.vue): divide el formulario en N pasos, de forma que no puedes pasar al siguiente hasta que el actual tenga datos válidos. [Ver el ejemplo de la versión mobile](../../src/components/iris-pages/create/GubAdd.vue).


## Campos personalizados

**En la carpeta [src/components/form-generator](../../src/components/form-generator) encontrarás todos los campos implementados para IRIS2.**

En esta sección enumeraremos los campos más importantes de la aplicación. Otros están implementados pero son autodescriptivos o es suficiente leer su documentación de uso que se puede encontrar dentro del componente.

### Pikaday

[FieldPikaday](../../src/components/form-generator/FieldPikaday.vue)

Permite la selección de fechas.

### Autocomplete

[FieldAutocomplete](../../src/components/form-generator/fieldAutocomplete.vue)

Selector con autocomplete cargando los datos desde el servidor, implementado extendiendo vue-select-2.

Se ofrecen versiones para cargar los datos desde el store:

[AutocompleteVuexSelect.vue](../../src/components/form-generator/masters/AutocompleteVuexSelect.vue)
[VuexSelect.vue](../../src/components/form-generator/masters/VuexSelect.vue)

Se pueden implementar otros tipos de autocomplete extendiendo el autocompleteMixin.js(../../src/components/form-generator/autocompleteMixin.js)

### Base64

[FieldBase64](../../src/components/form-generator/fieldBase64.vue)

Subida de ficheros convirtiendolo a base64.

### FileUploader

[FieldFileUploader](../../src/components/form-generator/fieldFileUploader.vue)

Subida de N ficheros que se subirán de forma previo al guardado, el valor del campo es la referencia a las pks de los ficheros subidos y ya creados.

### M2M Select

[FieldM2MSelect.vue](../../src/components/form-generator/FieldM2MSelect.vue)

Permite la selección de N items de una lista con búsqueda. Pensado para M2M, cuya tabla intermedia no tiene datos adicionales.

### Select List

[FieldSelectList](../../src/components/form-generator/fieldSelectList.vue)

Similar a M2M, solo que para tablas intermedias con datos. Cada item elegido tendrá un formulario para poder añadir la información que requiera dicha tabla intermedia. Puesto que necesita datos, requiere la definición del formulario por el que se editarán.

Por ejemplo, las aplicaciones de una temática, cada aplicación puede ser favorita o no:

```javascript
{
    type: 'select-list',
    uniqueField: 'id',
    inlineIdName: 'application',
    placeholder: 'Selecciona',
    labelField: 'description',
    label: vm.$t('theme_applications'),
    placeholder: vm.$t('theme_applications_selected'),
    required: true,
    initialValidation: true,
    url: '/api/masters/applications/',
    uid: 'applications',
    itemFormDef: new FormDefinition(
      {
        favorited: {
          type: 'favorite',
          label: 'Favorita',
        },
      },
      {
        fields: ['favorited'],
      }
    ),
    styleClasses: 'col-12',
  }
```

### Multiform

[FieldMultiform](../../src/components/form-generator/fieldMultiform.vue)

Editar una lista de N elementos, cada uno con su propio formulario y schema.

El mejor ejemplo es la página de [configuración](src/components/iris-pages/admin/ConfigurationEdit.vue)

### NestedForm

Permite añadir un formulario para un registro que se edita de forma anidada al campo.

```json
{
  "name": "example",
  "nested": {
    "nested-prop": "example"
  }
}
```

El Nested Form permitiría editar los datos del atributo nested, dentro del mismo formulario y respetando su estructura json final.

Ejemplo en [DistrictDerivation](../../src/components/iris-pages/admin/DistrictDerivation.vue)


### PortalTarget

[FieldPortalTarget](../../src/components/form-generator/FieldPortalTarget.vue)

Algunos campos requieren declararse fuera del formulario e introducirse en su maquetación, este campo permite añadir un [portal](https://portal-vue.linusb.org/) dentro del formulario.

```javascript
files: {
  type: 'portal-target',
  id: 'add-record-card-files',
  styleClasses: 'col-12',
}
```

El mejor ejemplo es la página de [configuración](../../src/components/iris-pages/create/AddRecordCard.vue)

## Próximos pasos

[Familiarizarse con los diferentes tipos de acciones](./actions.md)