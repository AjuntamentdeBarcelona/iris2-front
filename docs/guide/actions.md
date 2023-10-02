# Acciones

Junto con los listados y los formularios, las acciones son la tercera pata que cierra los conceptos más importantes de la implementación de IRIS2. Una acción es una transformación de estado que podemos hacer sobre la página o sobre un recurso.

Se ofrecen 3 tipos de acciones no excluyentes entre si:

- Con confirmación: la eliminación es un ejemplo, se le pregunta al usuario si está seguro.
- Con datos requeridos: se le presenta un formulario para que el usuario añada los datos necesarios para realizarla. Ejemplos son validar una ficha, reasignarla, etc.
- Con check previo: algunas acciones realizan comprobaciones previas para analizar las consecuencias del cambio del usuario y avisarle de eventuales problemas. La reasignación es un ejemplo, ya que se checkea si la ficha saldrá del ámbito y si es así, se informará al usuario antes de hacerlo.

## Implementación

### ToggleFlag

`Sin confirmación`, `Sin datos requeridos`, `Sin checks`

[ToggleFlag](../../src/components/pages/actions/ToggleFlag.vue)

Marca o desmarca una propiedad del recurso. 

Ejemplo: marcar o desmarca una [ficha como urgente](../../src/pages/backoffice/records/_id.vue).

```html
<toggle-flag
  :object="record"
  :retry-url="{name: $route.name}"
  action="toogle-reasignable"
  label-key="record_card_blocked_reassignation"
  flag-attr="reassignment_not_allowed"
  success-message-key="record_card_set_non_reassignable"
  success-message-key-false="record_card_set_reassignable"
  class="cardi__header__items__item"
  @value-changed="refresh"
/>
```

### Action

`Con confirmación`, `Sin datos requeridos`, `Sin checks`

[Action](../../src/components/pages/actions/Action.vue)

### DynamicTagModal

`Con y sin confirmación`, `Con y sin datos requeridos`, `Con y sin checks`

[DynamicTagModal](../../src/components/pages/actions/DynamicTagModal.vue)

Muestra un modal con un componente que requiere hacer la acción. En este caso se suele utilizar en conjunción con un formulario.

Ejemplo: elegir un template para la [respuesta de una ficha](../../src/components/iris-pages/records/process/AnswerTextEditor.vue):

```html
<dynamic-tag-modal
  v-b-tooltip="$t('answer_master_start_template_select')"
  ref="masterModal"
  :component-props="{variant:'outline-primary'}"
  :show-scroll="true"
  :preload="loadTemplates"
  :disabled="loadingTemplates"
  width="80%"
>
  <font-awesome-icon icon="list"/>
  <template slot="modal">
    <answer-master
      :record="record"
      @selected-template-text="newText"
      @default-found="setDefault"
      @loading="templateLoading" />
  </template>
</dynamic-tag-modal>
```

### Forms

`Con y sin confirmación`, `Con datos requeridos`, `Sin checks`

[`schemaForm`](../../src/components/pages/form/schemaForm.vue)

Los formularios son una acción por definición, ya que modifican el estado de un recurso en base a los datos del formulario.

### CheckModalFormButton

`Con y sin confirmación`, `Con datos requeridos`, `Con y sin checks`

[`CheckModalFormButton`](../../src/components/forms/buttons/CheckModalFormButton.vue)

Combinación de formulario y acción con check. Se pulsa un botón, se abre el modal con el formulario y antes de enviar se hacen los checks pertinentes.

Ejemplo: [anular una ficha](../../src/pages/backoffice/records/_id.vue).

```html
  <check-modal-form-button
    v-if="model.full_detail && manageVersion"
    :form-component="components.RecordCardCancel"
    :model="model"
    icon-prop="times"
    action-name="cancel"
    open-button-text-key="record_card_annul"
    modal-content-text-key="record_card_annul"
    open-button-variant="danger"
    class="ml-0"
    @action-done="onCancel"
  />
```

### DeleteButton

`Con confirmación`, `Sin datos requeridos`, `Sin checks`

[DeleteButton](../../src/components/pages/actions/DeleteButton.vue)

Botón de eliminación con confirmación.

Ejemplo: [tabla de templates de grupos](../../src/components/iris-pages/templates/TemplateTable.vue)

```html
<delete-button
  :object="ans"
  :url="answerTypeUrl"
  @deleted="answerTypeDeleted" />
```

## Próximos pasos

[PLUGINS](./plugin.md)