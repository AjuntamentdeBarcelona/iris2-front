<script>
import SchemaForm from '~/components/pages/form/schemaForm.vue'
import FormDefinition from '~/assets/js/forms/formDefinition.js'

function formDefinition(vm) {
  return new FormDefinition(
    {
      prefered_language: {
        type: 'autocomplete',
        url: '/services/iris/api/profiles/preferences-options/',
        required: true,
        label: vm.$t('select_prefered_lang'),
        placeholder: vm.$t('select'),
        optionLabelAttribute: 'name',
        offlineSearch: false,
        valueAttribute: 'name',
        values: [],
        isRestful: true,
        objectValue: true,
        styleClasses: 'col',
        excludeSelectedValuesByField: 'code',
        styleClasses: 'col-12',
        processAjaxResult: response => {
          return response.data.languages
        },
      },
    },
    {
      class: 'row',
      groups: [
        {
          legend: this.$t('configuration'),
          fields: ['prefered_language'],
        },
      ],
    }
  )
}

export default {
  name: 'EditProfileConfig',
  extends: SchemaForm,
  props: {
    title: {
      type: String,
      default: 'navigation_profile',
    },
    definition: {
      type: Function,
      default: formDefinition,
    },
    backUrl: {
      type: String,
      default: 'backoffice-dashboard',
    },
    checkAllRequired: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    async submit(event, onSuccess) {
      if (this.isReadyForSend(this.model)) {
        if (this.beforeSubmit(this.model)) {
          const prefered_language = this.model.prefered_language.code

          await this.$axios
            .$patch('/services/iris/api/profiles/profile-preferences/', {
              prefered_language: prefered_language,
            })
            .then(() => {
              this.$notify({
                group: 'iris',
                title: this.$t('action_success'),
                text: this.$t('language_changed'),
                type: 'success',
              })

              this.$router.push(
                this.switchLocalePath(prefered_language.toLowerCase())
              )
            })
            .catch(() => {
              this.$notify({
                group: 'iris',
                title: this.$t('error_unexpected_title'),
                text: this.$t('error_loading_data_explanation'),
                type: 'error',
              })
            })
        }
        return false
      }
      return false
    },
  },
}
</script>
