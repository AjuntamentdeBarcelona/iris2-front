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
        v-for="(group, index) of inputGroups"
        :key="group.street.uid"
        class="row w-100">
        <div class="col-8 form-group pr-0">
          <input
            :id="group.street.uid"
            :placeholder="$t('search_street')"
            class="form-control pr-3"
          >
        </div>
        <div class="col-4 form-group pr-0">
          <input
            :id="group.number.uid"
            :placeholder="$t('search_number')"
            class="form-control pr-3"
          >
        </div>
        <button
          v-if="canAddInputs(index)"
          class="unset-top rounded ngac ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only"
          @click="addInputPair"
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
import { uniqueId, get } from 'lodash'

/**
 * Extra schema options:
 * - multiple: enables adding multiple value pairs
 */
export default {
  name: 'FieldBcnStreetAddress',
  components: {
    Loader,
  },
  mixins: [abstractField],
  data() {
    return {
      inputGroups: [],
      loadingMap: true,
      loadingError: false,
      initialModel: null,
    }
  },
  computed: {
    inputValues() {
      return this.inputGroups.reduce((accumulator, group) => {
        const {
          id,
          description,
          street: { value: street },
          number: { value: number },
        } = group

        if (street !== null) {
          accumulator.push({
            id,
            description,
            street,
            number,
          })
        }

        return accumulator
      }, [])
    },
    inputValuesLength() {
      return this.inputValues.length
    },
    inputGroupsLength() {
      return this.inputGroups.length
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
        this.deleteInputGroups()
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
          await this.addInputPair()
        }
      } catch (error) {
        console.log(error)
        this.loadingError = true
      } finally {
        this.loadingMap = false
      }
    },
    async addInputPair() {
      const uid = uniqueId()
      const uids = {
        street: `field_bcn_street_input_${uid}`,
        number: `field_bcn_number_input_${uid}`,
      }

      const newInputGroup = this.createBaseInputPair(uids)
      await this.$nextTick()
      const [inputFieldStreet, inputFieldNumber] = this.createBcnInputPair(uids)
      this.teleportBcnDropdowns()

      newInputGroup.street.inputField = inputFieldStreet
      newInputGroup.number.inputField = inputFieldNumber
      return newInputGroup
    },
    createBaseInputPair(uids) {
      const newInputGroup = {
        street: { uid: uids.street, value: null, inputField: null },
        number: { uid: uids.number, value: null, inputField: null },
        get id() {
          return {
            street: get(this, 'street.value.description'),
            number: get(this, 'number.value.description'),
          }
        },
        get description() {
          const number = get(this, 'number.value.description')
          return `${get(this, 'street.value.description', '')}${
            number ? ' ' + number : ''
          }`
        },
      }

      this.inputGroups.push(newInputGroup)

      return newInputGroup
    },
    createBcnInputPair(uids) {
      const vm = this

      const streetAutocompleteField = new geoBCN.Html.InputAutocomplete({
        inputId: uids.street,
        label: vm.$t('street'),
        mostraLabel: false,
        origen: function(request, response) {
          geoBCN.Cercadors.cercaCarrers({
            nom: streetAutocompleteField.getText(),
            resultat: function(data) {
              response(
                geoBCN.Utils.mapResults(data.resultats, function(item) {
                  return {
                    label: item['nom27'],
                    value: {
                      id: item['codi'],
                      description: item['nom27'],
                    },
                    item: item,
                  }
                })
              )
            },
          })
        },
        esborrat: function(uid) {
          vm.onRemoveStreet(uid)
        },
        seleccio: function(event, item) {
          vm.onSelectStreet(event, item)
        },
      })

      const numberAutocompleteField = new geoBCN.Html.InputAutocomplete({
        inputId: uids.number,
        label: vm.$t('Number'),
        mostraLabel: false,
        master: streetAutocompleteField,
        masterRequired: true,
        combobox: true,
        origen: function(request, response) {
          geoBCN.Cercadors.cercaPortals({
            id_via: streetAutocompleteField.getCodi().id,
            numero: numberAutocompleteField.getText(),
            resultat: function(data) {
              response(
                geoBCN.Utils.mapResults(data.resultats, function(item) {
                  return {
                    label: item['numeracioPostal'],
                    value: {
                      id: item['id'],
                      description: item['numeracioPostal'],
                    },
                    item: item,
                  }
                })
              )
            },
          })
        },
        esborrat: function(uid) {
          vm.onRemoveNumber(uid)
        },
        seleccio: function(event, item) {
          vm.onSelectNumber(event, item)
        },
      })

      return [streetAutocompleteField, numberAutocompleteField]
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
    onSelectStreet(event, value) {
      const uid = event.target.id
      const inputGroup = this.inputGroups.find(
        group => group.street.uid === uid
      )
      inputGroup.street.value = value

      this.inputGroups = [...this.inputGroups]
    },
    onRemoveStreet(uid) {
      if (this.inputGroupsLength > 1) {
        this.inputGroups = this.inputGroups.filter(
          group => group.street.uid !== uid
        )
      } else {
        this.inputGroups[0].street.value = null
      }
    },
    onSelectNumber(event, value) {
      const uid = event.target.id
      const inputGroup = this.inputGroups.find(
        group => group.number.uid === uid
      )
      inputGroup.number.value = value
      // Forced update, since the (watched) inputValues computed won't recompute on this scenario
      this.inputGroups = [...this.inputGroups]
    },
    onRemoveNumber(uid) {
      const inputGroup = this.inputGroups.find(
        group => group.number.uid === uid
      )
      inputGroup.number.value = null
    },
    async generateInitialFields(fieldModel) {
      if (fieldModel && fieldModel.length) {
        for (const inputGroup of fieldModel) {
          const newInputGroup = await this.addInputPair()

          newInputGroup.street.value = inputGroup.street
          const numberValue = get(inputGroup, 'number', null)
          newInputGroup.number.value = numberValue

          newInputGroup.street.inputField.setPropietats({
            text: inputGroup.street.description,
            codi: inputGroup.street.id,
            valor: {
              id: inputGroup.street.id,
              description: inputGroup.street.description,
            },
          })

          if (numberValue !== null) {
            newInputGroup.number.inputField.setPropietats({
              text: inputGroup.number.description,
              codi: inputGroup.number.id,
              valor: {
                id: inputGroup.number.id,
                description: inputGroup.number.description,
              },
            })
          }
        }
      } else {
        this.addInputPair()
      }
    },
    deleteInputGroups() {
      this.inputGroups.forEach(inputGroup => {
        // Removing geoBCN attachement
        Object.values(inputGroup).forEach(inputGroupKey => {
          if (inputGroupKey.inputField) {
            inputGroupKey.inputField.esborra()
          }
        })
      })
      this.inputGroups = []
    },
    canAddInputs(index) {
      if (!this.schema.multiple) return false

      return (
        index + 1 === this.inputGroupsLength &&
        this.inputGroupsLength === this.inputValuesLength
      )
    },
    ...mapActions('geobcn', ['geoBCN']),
  },
}
</script>

<style lang="scss" scoped>
/deep/ .form-row {
  margin-right: unset;
  margin-left: unset;
}

/deep/ label {
  display: none;
}

/deep/ .unset-top {
  top: unset !important;
}

.form-size {
  height: 2.5rem;
}
</style>
