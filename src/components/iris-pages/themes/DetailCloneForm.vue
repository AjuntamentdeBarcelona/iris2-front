<script>
import SchemaForm from '~/components/pages/form/schemaForm.vue'
import FormDefinition from '~/assets/js/forms/formDefinition.js'
import { validators } from 'vue-form-generator'
import ElementTreeField from '~/components/iris-pages/themes/ElementTreeField.vue'

const formDefinition = vm =>
  new FormDefinition(
    {
      element_id: {
        component: ElementTreeField,
        inputType: 'number',
        label: vm.$t('record_card_element'),
        placeholder: vm.$t('record_card_select_element'),
        optionLabelAttribute: 'description',
        url: '/api/theme/elements/autocomplete/',
        styleClasses: 'col-12',
        getSaveValue(element) {
          return element.id
        },
      },
      description: {
        type: 'textArea',
        max: 255,
        min: 3,
        rows: 2,
        styleClasses: 'col-12',
        label: '',
        placeholder: vm.$t('record_card_description'),
        required: true,
        validator: validators.string.locale(),
      },
    },
    {
      class: 'row',
      groups: [
        {
          fields: ['element_id'],
        },
        {
          legend: vm.$t('detail_copy_descriptions'),
          fields: ['description'],
        },
      ],
    }
  ).translatable(vm, ['description'])

export default {
  name: 'DetailCloneForm',
  extends: SchemaForm,
  props: {
    definition: {
      type: Function,
      default: formDefinition,
    },
    backButton: {
      type: Boolean,
      default: false,
    },
    saveButtonText: {
      type: String,
      default: 'detail_copy',
    },
    saveButtonIcon: {
      type: String,
      default: 'clone',
    },
  },
  data() {
    return {
      successMessageTitle: this.$t('detall_copy_success_title'),
    }
  },
}
</script>

<style lang="scss" scoped>
/* Allows textarea's rows attribute to work */
/deep/ .form-group.field-textArea .form-control {
  height: unset;
}
</style>
