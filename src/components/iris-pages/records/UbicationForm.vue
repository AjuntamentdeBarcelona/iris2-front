<script>
import FormDefinition from '~/assets/js/forms/formDefinition.js'
import { validators } from 'vue-form-generator'
import SchemaForm from '~/components/pages/form/schemaForm.vue'

export function ubicationDefinition(vm) {
  return new FormDefinition(
    {
      via_type: {
        type: 'input',
        inputType: 'text',
        label: vm.$t('answer_address_type'),
        placeholder: vm.$t('answer_address_type_placeholder'),
        styleClasses: 'col-3 col-lg-2',
        required: true,
        min: 1,
        max: 10,
        validator: validators.string.locale(),
      },
      number: {
        type: 'input',
        inputType: 'text',
        label: vm.$t('answer_address_number'),
        placeholder: vm.$t('answer_address_number_placeholder'),
        styleClasses: 'col-3 col-lg-2',
        required: true,
        min: 1,
        max: 20,
        validator: validators.string.locale(),
      },
      stair: {
        type: 'input',
        inputType: 'text',
        label: vm.$t('answer_address_stair'),
        placeholder: vm.$t('answer_address_stair'),
        styleClasses: 'col-3 col-lg-2',
        required: false,
        min: 1,
        max: 20,
        validator: validators.string.locale(),
      },
      floor: {
        type: 'input',
        inputType: 'text',
        label: vm.$t('answer_address_floor'),
        placeholder: vm.$t('answer_address_floor'),
        styleClasses: 'col-3 col-lg-2',
        required: false,
        min: 1,
        max: 20,
        validator: validators.string.locale(),
      },
      door: {
        type: 'input',
        inputType: 'text',
        label: vm.$t('answer_address_door'),
        placeholder: vm.$t('answer_address_door'),
        styleClasses: 'col-3 col-lg-2',
        required: false,
        min: 1,
        max: 20,
        validator: validators.string.locale(),
      },
      postal_code: {
        type: 'input',
        inputType: 'text',
        label: vm.$t('answer_address_postal_code'),
        placeholder: vm.$t('answer_address_number_placeholder'),
        styleClasses: 'col-3 col-lg-2',
        required: true,
        min: 5,
        max: 10,
        validator: validators.string.locale(),
      },
      official_street_name: {
        type: 'input',
        inputType: 'text',
        label: vm.$t('answer_address'),
        placeholder: vm.$t('answer_address'),
        styleClasses: 'col-12 col-lg-6',
        required: true,
        min: 3,
        max: 200,
        validator: validators.string.locale(),
      },
    },
    {
      groups: [
        {
          fields: [
            'via_type',
            'official_street_name',
            'number',
            'stair',
            'floor',
            'door',
          ],
        },
      ],
    }
  )
}

/**
 * Backup form for selecting RecordCard ubications.
 *
 * Meant for being used when there are problems with the GeoBCN plugins.
 */
export default {
  name: 'UbicationForm',
  extends: SchemaForm,
  props: {
    definition: {
      type: [Function, Object],
      default: ubicationDefinition,
    },
    showBox: {
      type: Boolean,
      default: false,
    },
    backup: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    this.afterUpdate = _.debounce(this.afterUpdate, 500)
  },
  mounted() {
    this.validate()
  },
  methods: {
    /**
     * This form will receive the same data as the GeoBCN component.
     * @param initial.address Full street name
     * @param initial.official_street_name
     * @param initial.floor
     * @param initial.number
     * @param initial.stair
     * @param initial.district Nombre de districte
     * @param initial.localitzacio Coordinates
     * @param initial.localitzacio.x xetrs89a coordinates
     * @param initial.localitzacio.y yetrs89a coordinates
     */
    applyInitialTransformation(initial) {
      return {
        ...initial,
        number: initial.street2,
      }
    },
    getSaveData(model) {
      return {
        ...model,
        street2: model.number,
        street: `${model.via_type} ${model.official_street_name}`,
      }
    },
    /**
     * Adjust schema for setting field uids
     */
    adaptSchema(schemaDef) {
      schemaDef.setAllUid()
    },
    afterUpdate() {
      if (this.isReady(this.model)) {
        this.$emit('address-selected', this.getSaveData(this.model))
      } else {
        this.$emit('address-deleted', {})
      }
    },
    isReady(model) {
      return !!(model.official_street_name && model.via_type && model.number)
    },
    /**
     * Proxy method to the underliying form.
     */
    validate() {
      if (this.$refs.form) {
        return this.$refs.form.validate()
      }
    },
    /**
     * Emit the validated method.
     */
    validated(valid, errors) {
      this.valid = valid
      this.$emit('validated', valid, errors, this.$refs.form)
    },
    /**
     * Since this is a subform, it must no show save or back buttons
     */
    getDefaultButtons() {
      return []
    },
  },
}
</script>
