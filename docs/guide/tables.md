# Tablas y listados

El sistema de tablas de IRIS2 se basa en utilizar la librería [vue-tables](https://github.com/matfish2/vue-tables-2) y extenderla con herramientas y tipos de columnas que permitan su integración con Rest Framework.

## Listados

El [componente de listado](../../src/components/pages/List.vue) permite la implementación sencilla de listados, solo pide una url y se encargará del flujo de carga, de forma que una vez listo renderizará el contenido que le pasas a su slot.

Ejemplo: pintar una lista de tareas planificadas:

```html
<list 
  :url="url" 
  @loaded="onLoad">
  <template
    slot="list-items"
    slot-scope="{ item }">
    <span class="scheduled">
      {{ item.task }} - 
      {{ item.scheduled_date|dateTime }} -
      {{ $t('requested_by') }} {{ item.created_by }}
    </span>
  </template>
</list>
```

Además de usar en formato slot, se puede usar con herencia, como hace el componente [Announcements, que muestra los anuncios en el dashboard](src/components/iris-pages/admin/Announcements.vue).

Este componente y su lógica de carga, sirve de base para el otro gran componente para mostrar listados, el de tabla.

## Tablas

El sistema de tablas declarativas es la verdadera potencia del módulo de carga, contruye una tabla con una url y un schema sobre las columnas, sus tipos y como se dibujan. La configuración de las columnas permite la composición inyectando un tipo concreto, por ejemplo una columna para mostrar una fecha formateada.

### Especificación de tablas

El formato de epecificación de las columnas es el de [vue-tables](https://github.com/matfish2/vue-tables-2), por lo que en ese sentido no se ha hecho ninguna extensión y se puede consultar en su web.

Para entenderlo mejor, aquí listado un ejemplo de tabla sencilla que ilustra como se crea una página con una tabla. Tomaremos como referencia el componente que muestra el [listado de fichas que forman parte de un proceso](../../src/components/iris-pages/records/UnirecordTable.vue)

```javascript
import TableList from '~/components/pages/list/table.vue'
import RecordId from '~/components/tables/columns/RecordId'
import DateTimeColumn from '~/components/pages/list/columns/DateTimeColumn.vue'

export default {
  name: 'UnirecordTable',
  extends: TableList,
  props: {
    title: {
      type: String,
      default: '',
    },
    hidePagination: {
      type: Boolean,
      default: true,
      required: false,
    },
    listResultType: {
      type: String,
      default: 'list_result_type.record_card',
    },
  },
  data() {
    return {
      columns: ['normalized_record_id', 'description', 'created_at'],
      options: {
        perPage: 200,
        headings: {
          normalized_record_id: this.$t('record_card_normalized_record_id'),
          'element_detail.element.area.description': 'Àrea',
          'record_state.description': 'Estat',
          created_at: this.$t('notifications_created_at'),
        },
        templates: {
          normalized_record_id: RecordId,
          created_at: DateTimeColumn,
        },
      },
    }
  },
}
```

La tabla más rica en tipos de columnas y opciones es la del listado de fichas que se puede encontrar en [listado de fichas](../../src/components/iris-pages/records/RecordCardList.vue).

### Columnas

Como hemos visto en los ejemplos anteriores, podemos usar componentes para renderizar el valor de las columnas. Se pueden encontrar algunas de estos componente columna dentro del paquete [columns de list](../../src/components/pages/list/columns).

En la base solo vienen las columnas más habituales:
- DivColumn: envuelve el valor en un div.
- DateTimeColumn / DateColumn: para formatear fechas.
- BooleanColumn: mostrar booleanos con labels bien formateados y que no aparezca true/false del json.

En el directorio tables están las [columnas especificas de iris](../../src/components/tables).

Cada una de estas columnas tiene su documentación de uso y sus propiedades listadas en su fichero.

### Tablas seleccionables

El sistema de tablas incluye la posibilidad de ser ampliado al estilo de plugins, de forma que un componente padre extiende las funcionalidades de la tabla de abajo. En este caso, solo tenemos el [plugin para convertir una tabla en seleccionable](../../src/components/pages/list/SelectTable.vue).

Su uso es sencillo, basta con añadir el `select-table` como componente padre de una tabla para hacerla seleccionable. En la propiedad `initial` podemos fijar los items seleccionados inicialmente y cada vez que la selección cambia se emite el evento `selected-change`.

```html
<select-table
  :initial="selected"
  id-attr="id"
  @selected-change="onChangeSelection">
  <files-table
    :prop-data="files"
    :allow-delete="false"
    :per-page="10000"
  />
</select-table>
```

### Guardar orden

Si el usuario clica en las columnas el listado actualiza su orden en función de las columnas clickadas. Si se activa la props `enableSaveOrdering` se añaden dos botones para guardar o borrar el orden en el local storage.

El [listado de áreas](../../src/pages/backoffice/admin/records/theme/index.vue) es un ejemplo.

### Descargar excel

Para añadir un botón que permita la descarga de excel, basta con poner a true la propiedad `enableDowloadExcel`.

El [listado de elementos](../../src/pages/backoffice/admin/records/theme/element/index.vue) es un ejemplo.

### Otras opciones

Las tablas permiten insertar datos sin cargarlos del servidor con la prop `prop-data`. Si esta prop se pasa, no se hacen llamadas al servidor.

También comprueban si se permite la eliminación, de forma que se permitirá borrar un item si este tiene el campo can_delete a true y la prop `allowDelete` a true.

El botón de editar aparece si la tabla tiene la prop `allowEdit` y la prop `detailUrl` está también seteada.

## Fijar el orden de objetos

Algunos objetos tiene el campo orden, que marca como debe ser mostrado a los usuarios, que no a los administradores que lo ven ordenados alfabéticamente. La opción de fijar dicho orden por drag & drop se muestra si se pasa la prop `orderUrl`, que indica a que endpoint debe hacer el post para fijar el nuevo orden del usuario.

Por ejemplo, si la url es `/api/theme/element`, el post con el nuevo orden se mandará a `/api/theme/element/{pk}/set-order/{position}`. Este comportamiento se implementa en [SetOrder](../../src/components/pages/list/SetOrder.vue)

## Tablas filtrables

Con el componente [FilteredList](../../src/components/pages/list/FilteredList.vue) podemos construir de forma sencilla tablas filtradas en base a un formulario. Básicamente, hay que definir el schema del formulario y el componente de la tabla, automáticamente ya ajusta el comportamiento y hace que la tabla se filtre en función de los datos del form.

Un ejemplo es el componente que muestra el [listado de tareas planificadas](../../src/pages/backoffice/admin/batch/schedule/index.vue)

```javascript
export default {
  name: 'ScheduledTaskList',
  extends: FilteredList,
  mixins: [AdminMixin],
  props: {
    filterFormDefinition: {
      type: [Object, Function],
      default: () => getFilterFormDefinition,
    },
    listComponent: {
      type: Object,
      default: () => ScheduledTaskList,
    },
    title: {
      type: String,
      default: 'batch_manual_log',
    },
  },
}
```

## Siguientes pasos

Una vez comprendido el sistema de tablas, es importante conocer el sistema de formularios, que además es necesario para definir los filtros.

[SISTEMA DE FORMULARIOS](./forms.md)