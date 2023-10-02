<script>
import SchemaForm from '~/components/pages/form/schemaForm.vue'
import FormDefinition from '~/assets/js/forms/formDefinition.js'
import SchemaUtils from '~/assets/js/iris2/forms/SchemaUtils.js'
import VuexSelect from '~/components/form-generator/masters/VuexSelect.vue'
import OneOfFielset from '~/components/form-generator/layout/OneOfFieldset.vue'

function getFeatureDefinition(vm) {
  const description = SchemaUtils.getDescription(
    100,
    null,
    vm.$t('description'),
    'description',
    {
      placeholder: vm.$t('description'),
    }
  )

  const explanations = SchemaUtils.getDescription(
    null,
    null,
    vm.$t('feature_explanation'),
    'explanatory_text',
    {
      type: 'textArea',
      required: false,
      placeholder: vm.$t('text'),
    }
  )
  return new FormDefinition(
    {
      ...description,
      ...explanations,
      mask_id: {
        type: 'autocomplete',
        url: '/api/features/masks/',
        placeholder: vm.$t('please_select'),
        styleClasses: 'col-12',
        label: vm.$t('features_mask_type'),
        title: vm.$t('features_mask'),
        optionLabelAttribute: 'description',
        getInitialOption: function(model) {
          return model.mask
        },
      },
      values_type_id: {
        type: 'autocomplete',
        url: '/api/features/values_types/',
        styleClasses: 'col-12',
        placeholder: vm.$t('please_select'),
        title: vm.$t('features_select_list'),
        label: vm.$t('features_select_list_type'),
        optionLabelAttribute: 'description',
        getInitialOption: function(model) {
          return model.values_type
        },
      },
      is_special: {
        type: 'checkbox',
        label: vm.$t('feature_is_special'),
        styleClasses: 'col-12 col-lg-2',
      },
      visible_for_citizen: {
        type: 'checkbox',
        label: vm.$t('feature_visible_for_citizen'),
        styleClasses: 'col-12 col-lg-2',
      },
      editable_for_citizen: {
        type: 'checkbox',
        label: vm.$t('feature_editable_for_citizen'),
        styleClasses: 'col-12 col-lg-2',
      },
      ...SchemaUtils.getDescription(40, null, vm.$t('codename'), 'codename', {
        placeholder: vm.$t('codename'),
      }),
      ...SchemaUtils.getDescription(
        40,
        null,
        vm.$t('codename_iris'),
        'codename_iris',
        {
          placeholder: vm.$t('codename_iris'),
        }
      ),
    },
    {
      fields: [],
      class: 'row',
      groups: [
        {
          legend: vm.$t('configuration'),
          fields: ['description'],
        },
        {
          legend: vm.$t('feature_explanation_title'),
          fields: ['explanatory_text'],
        },
        {
          legend: '',
          fields: ['is_special', 'visible_for_citizen', 'editable_for_citizen'],
        },
        {
          legend: '',
          fields: ['codename', 'codename_iris'],
        },
        {
          groups: [
            {
              component: OneOfFielset,
              legend: vm.$t('feature_values_configuration'),
              fields: ['mask_id', 'values_type_id'],
            },
          ],
        },
      ],
    }
  ).translatable(vm, ['description', 'explanatory_text'])
}

/**
 * Vue Component for editing objects in forms automatically generated in base of a FormDefinition object.
 * By default, this component saves the data by sending it to an endpoint via HTTP and, if success, redirects
 * to a given URL. However, it also provides many overridable methods in order to customize the flow or its actions.
 */
export default {
  name: 'FeatureForm',
  extends: SchemaForm,
  props: {
    url: {
      type: String,
      default: '/api/features/features/',
    },
    title: {
      type: String,
      default: 'navigation_attributes',
    },
    addNewUrl: {
      type: String,
      default: 'backoffice-admin-records-attributes-add',
    },
    successUrl: {
      type: String,
      default: 'backoffice-admin-records-attributes',
    },
    backUrl: {
      type: String,
      default: 'backoffice-admin-records-attributes',
    },
    definition: {
      type: Function,
      default: getFeatureDefinition,
      required: false,
    },
  },
  data() {
    return {
      successMessageTitle: this.$t('success_save'),
    }
  },
  methods: {
    /**
     * Override getSaveData for adjusting the type of value, only one of them can
     * be sent.
     */
    getSaveData(model) {
      if (model.values_type_id != null) {
        return { mask_id: null }
      } else {
        return { values_type_id: null }
      }
    },
  },
}
</script>
