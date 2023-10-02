<template>
  <div class="geobcn">
    <div class="form-row">
      <div class="form-group col-12 col-lg-6 required">
        <input
          :id="addressId"
          v-model="address"
          :placeholder="$t('search_address')"
          class="form-control">
      </div>
      <div
        class="form-group col-4 col-lg-2 required">
        <input
          :id="numberId"
          v-model="number"
          :placeholder="$t('Number')"
          class="form-control">
      </div>
      <div
        v-if="selectStair"
        class="form-group col-2 col-lg-1">
        <label for="door">{{ $t('stair') }}</label>
        <input
          v-model="stair"
          :placeholder="$t('stair')"
          class="form-control"
          name="stair"
          @change="selectAddress">
      </div>
      <div
        v-if="selectDoor"
        class="form-group col-2 col-lg-1">
        <label for="floor">{{ $t('Floor') }}</label>
        <input
          v-model="floor"
          :placeholder="$t('Floor')"
          class="form-control"
          name="floor"
          @change="selectAddress">
      </div>
      <div
        v-if="selectDoor"
        class="form-group col-2 col-lg-1">
        <label for="door">{{ $t('Door') }}</label>
        <input
          v-model="door"
          :placeholder="$t('Door')"
          class="form-control"
          name="door"
          @change="selectAddress">
      </div>
    </div>
    <div
      :id="id"
      class="bcn-map"/>
  </div>
</template>

<script>
import Vue from 'vue'
import LoadScript from 'vue-plugin-load-script'
import _ from 'lodash'
import { mapActions } from 'vuex'

Vue.use(LoadScript)

export default {
  props: {
    id: {
      type: String,
      default: 'map',
    },
    value: {
      type: Object,
      default: () => {
        return {}
      },
    },
    selectStair: {
      type: Boolean,
      default: false,
    },
    selectDoor: {
      type: Boolean,
      default: true,
    },
  },
  data: function() {
    return {
      geoAddress: null,
      address: '',
      number: '',
      floor: '',
      stair: '',
      door: '',
      map: null,
      streetAutocomplete: null,
      numberAutocomplete: null,
      mapPromise: null,
      mapZoomSelection: 5,
      marker: null,
    }
  },
  computed: {
    addressId() {
      return `${this.id}-adress-picker`
    },
    numberId() {
      return `${this.id}-number-picker`
    },
  },
  mounted() {
    this.loadMap()
    this.setInitial()
  },
  methods: {
    ...mapActions('geobcn', ['geoBCN']),
    setInitial() {
      if (!_.isEmpty(this.value)) {
        this.door = this.value.door
        this.floor = this.value.floor
        this.stair = this.value.stair
        this.address = this.value.address
        this.number = this.value.number
        if (this.mapPromise) {
          this.mapPromise.then(map => {
            this.setInitialMap(map)
          })
        } else {
          this.setInitialMap(map)
        }
      }
    },
    loadMap() {
      var self = this
      this.mapPromise = new Promise((resolve, reject) => {
        this.geoBCN()
          .then(geoBCN => {
            initMap()
            function initMap() {
              var map = new geoBCN.Map({
                divId: self.id,
                mode: 'ADR',
                fons: ['BAS'],
                eines: ['ROTACIO', 'ESCALIMETRE'],
                rotacio: 44.400000007,
                centre: {
                  proj: 'EPSG:25831',
                  x: 431610.0786,
                  y: 4583407.2375,
                },
                zoom: 2,
                seleccioAdreca: onSelectFromMap,
              })
              self.map = map

              $('.geobcn-rotacio-tornar').click()
              var streetAutocomplete = new geoBCN.Html.InputAutocomplete({
                inputId: self.addressId,
                label: self.$t('street') + ' *',
                origen: function(request, response) {
                  geoBCN.Cercadors.cercaCarrers({
                    nom: streetAutocomplete.getText(),
                    nomesCamps: ['NomComplet', 'Codi'],
                    resultat: function(data) {
                      response(
                        geoBCN.Utils.mapResults(data.resultats, function(item) {
                          return {
                            label: item['nomComplet'],
                            value: item,
                          }
                        })
                      )
                    },
                  })
                },
                esborrat: function() {
                  map.hideTooltip()
                  onRemoveAddress(null)
                },
                seleccio: function(ev, address) {
                  self.address = address.nomComplet
                  onSelectAddress(address.codi)
                },
              })
              self.streetAutocomplete = streetAutocomplete

              var numberAutocomplete = new geoBCN.Html.InputAutocomplete({
                inputId: self.numberId,
                label: self.$t('Number') + ' *',
                master: streetAutocomplete,
                masterRequired: true,
                origen: function(request, response) {
                  geoBCN.Cercadors.cercaPortals({
                    id_via: streetAutocomplete.getCodi().codi,
                    numero: numberAutocomplete.getText(),
                    resultat: function(data) {
                      response(
                        geoBCN.Utils.mapResults(data.resultats, function(item) {
                          return {
                            label: item['numeracioPostal'],
                            value: item,
                          }
                        })
                      )
                    },
                  })
                },
                esborrat: function() {
                  onRemoveAddress(null)
                },
                seleccio: function(ev, address) {
                  onSelectAddress(address)
                },
              })
              self.numberAutocomplete = numberAutocomplete

              /**
               * WORKAROUND AUTOCOMPLETE SCOPED CSS
               * Since autocomplete menu-items are appended to the end of the page, outside the component,
               * we need to wrap them on a div with the "geobcn" class, that is used as a css scope marker.
               * Without a parent div with the class "geobcn" the autocomplete don't gets its styles.
               */
              var $geoBcn =
                $('body > .geobcn').length > 0
                  ? $('body > .geobcn')
                  : $('body').append('<div class="geobcn">')
              $('.ui-autocomplete.ui-front.ui-menu').appendTo('body > .geobcn')

              function onSelectAddress(address) {
                self.onAddressSelected(address)
              }

              function onSelectFromMap(address) {
                onSelectAddress(address)
                self.setAddressProperties(address)
                self.setNumberProperties()
              }

              function onRemoveAddress() {
                map.amagaPopup()
                map.esborraMarcador(self.marker)
                self.marker = null
                self.removeAddress()
                this.number = null
                self.setNumberProperties()
              }
              self.map = map
              self.onSelectAddress = map
              resolve(
                map,
                streetAutocomplete,
                numberAutocomplete,
                onSelectAddress
              )
            }
          })
          .catch(e => {
            console.log(e)
            reject('Cannot load map')
            this.$emit('cannot-load')
          })
      })
    },
    setInitialMap(map) {
      map.centrar({
        localitzacio: this.value.localitzacio,
        zoom: 5,
      })
      this.marker = map.afegeixMarcador({
        localitzacio: this.value.localitzacio,
        popup: {
          html: `<span class="map-title">${this.value.address} ${
            this.value.number
          }</span>`,
        },
      })
      if (geoBCN && this.address && this.streetAutocomplete) {
        this.value.localitzacio
          ? this.findInitialByLocation()
          : this.findInitialByAddress()
      }
    },
    /**
     * Sets the selected address and emits the event.
     */
    selectAddress() {
      if (this.geoAddress) {
        this.$emit(
          'address-selected',
          Object.assign({}, this.geoAddress, {
            floor: this.floor || '',
            door: this.door || '',
            stair: this.stair || '',
          })
        )
      }
    },
    removeAddress() {
      this.$emit('address-deleted', {})
    },
    onAddressSelected(address) {
      if (this.marker) {
        this.map.esborraMarcador(this.marker)
      }
      this.marker = this.map.afegeixMarcador({
        localitzacio: address.localitzacio,
        popup: {
          html: `<span class="map-title">${address.nomComplet}</span>`,
        },
      })
      this.map.centrar({
        localitzacio: address.localitzacio,
        zoom: this.mapZoomSelection,
      })
      this.address = address.carrer.nomComplet
      this.number = address.numeracioPostal
      if (!this.number) {
        numberAutocomplete.setPropietats({})
      }
      this.geoAddress = address
      this.selectAddress()
    },
    /**
     * Use the geoBcn search features for obtaining the initial geoAddress
     * and init the different autocomplete fields.
     */
    findInitialByAddress() {
      geoBCN.Cercadors.cercaCarrers({
        nom: this.address,
        resultat: res => {
          const findAddress = this.address ? this.address.toUpperCase() : ''
          if (res.estat == 'OK') {
            const carrer = res.resultats.filter(
              item =>
                item.nom27 == this.address ||
                item.nomLlarg.toUpperCase() == findAddress ||
                item.nomComplet.toUpperCase() == findAddress
            )
            if (carrer.length) {
              geoBCN.Cercadors.cercaPortals({
                id_via: carrer[0].codi,
                numero: this.number,
                resultat: res => {
                  if (res.estat == 'OK') {
                    this.setAddressProperties(res.resultats[0])
                    this.setNumberProperties()
                    // Avoid changing the address name
                    this.onAddressSelected({
                      ...res.resultats[0],
                      carrer: {
                        ...res.resultats[0].carrer,
                        nomLlarg: this.address,
                      },
                    })
                  }
                },
              })
            } else {
              // NOT FOUND ---> MUST SELECT ANOTHER ADDRESS
              this.removeAddress()
              this.$notify({
                group: 'iris',
                title: this.$t('ubication_not_found_title'),
                type: 'error',
                text: this.$t('ubication_not_found'),
              })
            }
          }
        },
      })
    },
    /**
     * Finds initial position by reverse geocoding the location.
     */
    findInitialByLocation() {
      geoBCN.Cercadors.revGeocodingAdr({
        x: this.value.localitzacio.x,
        y: this.value.localitzacio.y,
        proj: this.value.localitzacio.proj,
        max: 10,
        radi: 40,
        resultat: res => {
          if (res.estat === 'OK') {
            //Tractem resultats
            const findAddress = this.address ? this.address.toUpperCase() : ''
            const address = res.resultats.filter(
              address =>
                address.carrer.nom.toUpperCase() == findAddress ||
                address.carrer.nomLlarg.toUpperCase() == findAddress ||
                address.carrer.nomComplet.toUpperCase() == findAddress
            )
            if (address.length > 0) {
              this.setAddressProperties({
                ...address[0],
                street: this.address,
              })
              if (!this.value.via_type) {
                this.onAddressSelected(address[0])
              }
              if (this.number) {
                this.setNumberProperties()
              }
            } else {
              this.findInitialByAddress()
            }
          } else {
            //Tractem error
            this.findInitialByAddress()
          }
        },
      })
    },
    setNumberProperties() {
      this.numberAutocomplete.setPropietats({
        text: this.number,
        codi: this.number,
        valor: {
          label: this.number,
          value: this.number,
        },
      })
    },
    setAddressProperties(address) {
      this.streetAutocomplete.setPropietats({
        text: this.address,
        codi: address.carrer.codi,
        valor: {
          label: this.address,
          value: address.carrer.codi,
        },
      })
    },
    geoLocate() {
      this.$nuxt.$loading.start()
      geoBCN.Utils.geoLocalitza(position => {
        try {
          const loc = geoBCN.Utils.projectaLocalitzacio(
            {
              proj: 'WGS84',
              y: position.coords.latitude,
              x: position.coords.longitude,
            },
            'EPSG:25831'
          )
          geoBCN.Cercadors.revGeocodingAdr({
            x: loc.x,
            y: loc.y,
            proj: loc.proj,
            max: 10,
            radi: 40,
            resultat: res => {
              if (res.estat === 'OK') {
                //Tractem resultats
                if (res.resultats.length > 0) {
                  const address = res.resultats[0]
                  this.onAddressSelected(address)
                  this.setAddressProperties(address)
                  this.setNumberProperties()
                }
              } else {
                //Tractem error
              }
            },
          })
          this.$nuxt.$loading.finish()
        } catch (e) {
          this.$nuxt.$loading.finish()
        }
      })
    },
  },
}
</script>

<style lang="scss">
.geobcn {
  .errorInput {
    padding-left: 0;
    padding-top: 0.5rem;
  }
  .bcn-map {
    height: 300px;
  }
  .ui-state-default {
    border-top-right-radius: 4px !important;
    border-bottom-right-radius: 4px !important;
    position: absolute !important;
    // height: 2.6rem;
    top: 0;
    right: -2px;
  }
  .map-title {
    font-size: 0.8rem;
    padding-right: 14px;
  }
}
</style>
