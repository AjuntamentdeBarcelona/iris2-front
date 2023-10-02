<template>
  <loader
    v-if="loadingMap"
    class="form-size"
    minimal
  />
  <div
    v-else-if="loadingError"
    class="alert alert-danger"
    v-text="$t('record_cards_map_no_map')"
  />
  <div
    v-else
    class="geobcn"
  >
    <div class="form-row">
      <div
        v-for="(input, index) of inputs"
        :key="input.uid"
        class="form-group col-12 pb-0 mb-0">
        <input
          :id="input.uid"
          :placeholder="inputPlaceholder"
          class="form-control pr-3"
        >
        <button
          v-if="canAddInput(index)"
          class="ngac ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only"
          @click="addInput"
          v-text="'+'"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Loader from '~/components/utils/Loader'
import { abstractField } from 'vue-form-generator'
import { mapActions } from 'vuex'
import { uniqueId } from 'lodash'

/**
 * Extra schema options:
 * - multiple: enables adding multiple values
 */
export default {
  name: 'FieldBcnNeighbourhood',
  components: {
    Loader,
  },
  mixins: [abstractField],
  data() {
    return {
      inputs: [],
      loadingMap: true,
      loadingError: false,
      initialModel: null,
      inputPlaceholder: this.$t('reports_neighbourhood'),
    }
  },
  computed: {
    inputValues() {
      return this.inputs.reduce((accumulator, currentValue) => {
        if (currentValue.value) {
          accumulator.push(currentValue.value)
        }
        return accumulator
      }, [])
    },
    inputValuesLength() {
      return this.inputValues.length
    },
    inputsLength() {
      return this.inputs.length
    },
    mapLoaded() {
      return !this.loadingMap && !this.loadingError
    },
  },
  watch: {
    inputValues(val, oldVal) {
      this.value = val
    },
    async model(val, oldVal) {
      const fieldModel = val[this.schema.model]
      if (val.hasOwnProperty(this.schema.model) && this.loadingMap) {
        this.initialModel = fieldModel
      } else if (this.mapLoaded) {
        this.deleteInputs()
        await this.generateInitialFields(fieldModel)
      }
    },
  },
  mounted() {
    this.loadGeoBCN()
  },
  methods: {
    async loadGeoBCN() {
      try {
        await this.geoBCN()
        this.loadingMap = false

        if (this.initialModel) {
          await this.generateInitialFields(this.initialModel)
        } else {
          await this.addInput()
        }
      } catch (error) {
        console.log(error)
        this.loadingError = true
      } finally {
        this.loadingMap = false
      }
    },
    async addInput() {
      const uid = uniqueId('field_bcn_districts_input_')

      const newInput = this.createBaseInput(uid)
      await this.$nextTick()
      const inputField = this.createBcnInput(uid)
      this.teleportBcnDropdowns()

      newInput.inputField = inputField

      return newInput
    },
    createBaseInput(uid) {
      const newInput = { uid: uid, value: null, inputField: null }
      this.inputs.push(newInput)

      return newInput
    },
    createBcnInput(uid) {
      const vm = this

      const autoCompleteField = new geoBCN.Html.InputAutocomplete({
        inputId: uid,
        label: vm.$t('record_card_neighborhood'),
        mostraLabel: false,
        combobox: true,
        origen: function(request, response) {
          geoBCN.Cercadors.cercaBarris({
            nom: autoCompleteField.getText(),
            resultat: function(data) {
              response(
                geoBCN.Utils.mapResults(data.resultats, function(item) {
                  return {
                    label: item['nom'],
                    value: {
                      id: Number(item.codi),
                      description: item.nom,
                    },
                    item: item,
                  }
                })
              )
            },
          })
        },
        esborrat: function(uid) {
          vm.onRemoveValue(uid)
        },
        seleccio: function(event, item) {
          vm.onSelectValue(event, item)
        },
      })

      return autoCompleteField
    },
    /**
     * WORKAROUND AUTOCOMPLETE SCOPED CSS
     * Since autocomplete menu-items are appended to the end of the page, outside the component,
     * we need to wrap them on a div with the "geobcn" class, that is used as a css scope marker.
     * Without a parent div with the class "geobcn", the autocomplete dropdown won't get styled.
     */
    teleportBcnDropdowns() {
      let divContainer = document.querySelector('body > .geobcn')

      if (!divContainer) {
        divContainer = Object.assign(document.createElement('div'), {
          className: 'geobcn',
        })
        document.body.appendChild(divContainer)
      }

      const dropdowns = document.querySelectorAll(
        '.ui-autocomplete.ui-front.ui-menu'
      )

      dropdowns.forEach(node => divContainer.appendChild(node))
    },
    onSelectValue(event, value) {
      const uid = event.target.id
      const input = this.inputs.find(input => input.uid === uid)
      input.value = value

      this.inputs = [...this.inputs]
    },
    onRemoveValue(uid) {
      if (this.inputsLength > 1) {
        this.inputs = this.inputs.filter(input => input.uid !== uid)
      } else {
        this.inputs[0].value = null
      }
    },
    async generateInitialFields(fieldModel) {
      if (fieldModel && fieldModel.length) {
        for (const entry of fieldModel) {
          const newInput = await this.addInput()

          newInput.value = entry

          newInput.inputField.setPropietats({
            text: entry.description,
            codi: entry.id,
            valor: {
              id: entry.id,
              description: entry.description,
            },
          })
        }
      } else {
        this.addInput()
      }
    },
    deleteInputs() {
      this.inputs.forEach(input => {
        if (input.inputField) {
          // Removing geoBCN attachement
          input.inputField.esborra()
        }
      })
      this.inputs = []
    },
    canAddInput(index) {
      if (!this.schema.multiple) return false

      return (
        index + 1 === this.inputsLength &&
        this.inputsLength === this.inputValuesLength
      )
    },
    ...mapActions('geobcn', ['geoBCN']),
  },
}
</script>

<style lang="scss" scoped>
/deep/ .form-row {
  label {
    display: none;
  }
  .ui-state-default {
    top: 0 !important;
    height: 100%;
  }
}
</style>
