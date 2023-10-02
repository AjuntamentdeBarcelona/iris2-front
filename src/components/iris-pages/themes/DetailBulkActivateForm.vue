<script>
import SchemaForm from '~/components/pages/form/schemaForm.vue'
import FormDefinition from '~/assets/js/forms/formDefinition.js'

const formDefinition = vm =>
  new FormDefinition(
    {
      active: {
        type: 'select',
        values: [
          { id: true, name: vm.$t('yes') },
          { id: false, name: vm.$t('no') },
        ],
        selectOptions: {
          noneSelectedText: vm.$t('detail_dont_alter_field'),
        },
        label: vm.$t('detail_active_active'),
        styleClasses: 'col-lg-4',
      },
      alter_activation_date: {
        type: 'toggle',
        default: false,
        label: vm.$t('detail_alter_activation_date'),
        styleClasses: 'col-lg-4',
      },
      activation_date: {
        disabled: true,
        type: 'pikaday',
        default: null,
        format: 'YYYY-MM-DD',
        pikadayOptions: {
          format: 'DD/MM/YYYY',
        },
        label: "Data d'activació",
        placeholder: 'A partir de...',
        styleClasses: 'col-lg-8',
      },
    },
    {
      class: 'row',
      groups: [
        {
          fields: ['active'],
        },
        {
          fields: ['alter_activation_date', 'activation_date'],
        },
      ],
    }
  )

export default {
  name: 'DetailBulkActivateForm',
  extends: SchemaForm,
  props: {
    definition: {
      type: Function,
      default: formDefinition,
    },
    details: {
      type: Array,
      default: () => [],
    },
    url: {
      type: String,
      default: '/api/theme/details/active/',
    },
    backButton: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      successMessageTitle: this.$t('detall_bulk_configuration_success_title'),
    }
  },
  created() {
    this.defaultModel()
  },
  methods: {
    /**
     * Overwritten to send an array as required
     */
    constructSaveData(model) {
      const active = this.model.active != null ? this.model.active : undefined
      const activation_date = this.model.alter_activation_date
        ? this.model.activation_date
        : undefined

      return this.details.map(detail => ({
        id: detail.id,
        active: active,
        activation_date: activation_date,
      }))
    },
    /**
     * Overwritten to perform field validation
     */
    afterUpdate() {
      this.dateCheck()
    },
    dateCheck() {
      if (this.model.alter_activation_date) {
        this.schemaDef.fields.activation_date.disabled = false
      } else {
        this.schemaDef.fields.activation_date.disabled = true
      }
    },
    /**
     * Overwritten to get the detail description when the api sends errors
     */
    getElementDescriptionFromId(id) {
      return this.details.find(detail => detail.id == id).description
    },
  },
}
</script>
