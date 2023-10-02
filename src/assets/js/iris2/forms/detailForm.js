import FormDefinition from '~/assets/js/forms/formDefinition.js'
import VueFormGenerator from 'vue-form-generator'

function getDescription(vm, lang, required) {
  return {
    type: 'input',
    inputType: 'text',
    maxlength: 80,
    min: 3,
    label: vm.$t(lang),
    placeholder: 'Descripció',
    styleClasses: 'col-lg-12 col-xl-4',
    required: required,
    validator: VueFormGenerator.validators.string.locale({
      fieldIsRequired: vm.$t('theme_description_mandatory'),
      textTooSmall: vm.$t('theme_description_min_length'),
    }),
  }
}

function getTextDescription(vm, lang) {
  return {
    type: 'textArea',
    max: 255,
    min: 3,
    styleClasses: 'col-lg-12 col-xl-4',
    label: vm.$t(lang),
    placeholder: vm.$t('description'),
    required: true,
    validator: VueFormGenerator.validators.string,
  }
}

let detailFormDefinition = vm => {
  return new FormDefinition(
    {
      detail_code: {
        type: 'input',
        inputType: 'text',
        min: 3,
        maxlength: 12,
        label: "Codi d'element",
        validator: VueFormGenerator.validators.string.locale({
          fieldIsRequired: vm.$t('theme_description_mandatory'),
          textTooSmall: vm.$t('theme_description_min_length'),
        }),
      },
      area_id: {
        type: 'autocomplete',
        inputType: 'number',
        optionLabelAttribute: 'description',
        placeholder: 'Seleccioni un àrea',
        label: vm.$t('area'),
        url: '/api/theme/areas/',
        valueAttribute: 'id',
        isRestful: true,
        styleClasses: 'col-12 col-md-6 col-lg-4',
        getInitialOption: function(model) {
          return model.element ? model.element.area || null : null
        },
      },
      element_id: {
        type: 'autocomplete',
        inputType: 'number',
        label: vm.$t('element'),
        placeholder: 'Seleccioni un element',
        optionLabelAttribute: 'description',
        url: '/api/theme/elements/',
        valueAttribute: 'id',
        forwardFields: ['area_id'],
        requiredFields: ['area_id'],
        isRestful: true,
        styleClasses: 'col-12 col-md-6 col-lg-4',
        getInitialOption: function(model) {
          return model.element || null
        },
      },
      process: {
        type: 'vuex-select',
        label: vm.$t('detail_process'),
        storeAttribute: 'processes',
        storeModule: 'masters',
        storeAction: 'retrieveProcesses',
        styleClasses: 'col-6 col-lg-4',
        required: true,
      },
      record_type_id: {
        type: 'select-record-type',
        label: vm.$t('record_type_title'),
        styleClasses: 'col-6 col-lg-4',
        required: true,
      },
      short_description: {
        type: 'input',
        inputType: 'text',
        maxlength: 80,
        min: 3,
        label: '',
        placeholder: 'Descripció',
        styleClasses: 'col-lg-12 col-xl-4',
        required: false,
        validator: VueFormGenerator.validators.string.locale({
          fieldIsRequired: vm.$t('theme_description_mandatory'),
          textTooSmall: vm.$t('theme_description_min_length'),
        }),
      },
      description: {
        type: 'textArea',
        max: 255,
        min: 3,
        styleClasses: 'col-lg-12 col-xl-4',
        label: '',
        placeholder: vm.$t('description'),
        required: true,
        validator: VueFormGenerator.validators.string,
      },
    },
    {
      class: 'row',
      groups: [
        {
          fields: ['area_id', 'element_id', 'process'],
        },
        {
          fields: ['record_type_id'],
        },
        {
          legend: 'Descripció',
          fields: ['description'],
        },
      ],
    }
  ).translatable(vm, ['short_description', 'description'])
}
export default detailFormDefinition
