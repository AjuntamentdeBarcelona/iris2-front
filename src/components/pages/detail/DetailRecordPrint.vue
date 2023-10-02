<template>
  <span>
    <!-- Modal where the record's data is goint to show -->
    <!-- button for printing -->
    <button 
      :disabled="!isLoadedComponents"
      class="btn btn-primary" 
      @click="printContentPrinter">
      <font-awesome-icon icon="print" />
      {{ $t('print') }}
    </button>
    <hr>
    <!-- elements to print inside the Printer component, ref printer for access its function to print -->
    <printer 
      ref="printer" 
      :css="cssToPrint"
      :class="dynamicClass"
      class="printer"
    >
      <!-- template who loads the resource-->
      <detail
        ref="detail"
        :pk="idRecord"
        url="/api/record_cards/record_cards/"
      >
        <div
          slot="loading"
          class="loading-box"
        >
          <div class="loading-overlay">
            <div class="loader" />
          </div>
        </div>

        <!-- Data -->
        <template
          slot="object"
          slot-scope="{ model }"
        >
          <header class="title-pdf">
            <logo class="title-pdf__logo"/>
            <h2>
              {{ $t('record_card_record_card_characteristics') + ' ' + idRecord }}
            </h2>
          </header>

          <div class="printrecord">
              
               
            <div class="printrecord__main-title printrecord__firstTitle">
              <h3>{{ $t('record_card_general_data') }}</h3>
            </div>
            <hr>
                
            <!-- General information -->
            <div class="no-gutters">
              <div class="printrecord__card">
                <div class="printrecord__title">
                  {{ $t('record_card_record_card_code') }}
                </div>
                <!-- Add element detail decription to the title -->
                <div
                  :title="model.description"
                  class="printrecord__description">
                  {{ model.normalized_record_id }}
                </div>
              </div>
              <div class="printrecord__card">
                <div class="printrecord__title">
                  {{ $t('record_card_tipology') }}
                </div>
                <div class="printrecord__description">
                  {{ model.record_type.description }}
                </div>
              </div>
              <div class="printrecord__card">
                <div class="printrecord__title">
                  {{ $t('record_card_entry_channel') }}
                </div>
                <div
                  v-if="model.input_channel"
                  class="printrecord__description">
                  {{ model.input_channel.description }}
                </div>
                <div
                  v-if="!model.input_channel"
                  class="printrecord__description">
                  {{ $t('no_response_channel') }}
                </div>
              </div>
              <div class="printrecord__card">
                <div class="printrecord__title">
                  {{ $t('record_card_area') }}
                </div>
                <div class="printrecord__description">
                  {{ model.element_detail.element.area.description }}
                </div>
              </div>
              <div class="printrecord__card">
                <div class="printrecord__title">
                  {{ $t('record_card_element') }}
                </div>
                <div class="printrecord__description">
                  {{ model.element_detail.element.description }}
                </div>
              </div>
              <div class="printrecord__card">
                <div class="printrecord__title">
                  {{ $t('record_card_detail') }}
                </div>
                <div class="printrecord__description">
                  {{ model.element_detail.description }}
                </div>
              </div>
              <div class="printrecord__card">
                <div class="printrecord__title">
                  {{ $t('record_card_applicant') }}
                </div>
                <div
                  class="printrecord__description"
                >
                  <template v-if="get(model, 'applicant_type', null) !== null">
                    {{ model.applicant_type.description }}
                  </template>
                  <template v-else>-</template>
                </div>
              </div>
              <div class="printrecord__card">
                <div class="printrecord__title">
                  {{ $t('record_card_input_date') }}
                </div>
                <div class="printrecord__description">
                  {{ model.created_at | dateTime }}
                </div>
              </div>
              <div
                class="printrecord__card">
                <div class="printrecord__title">
                  {{ $t('record_card_protocol') }}
                </div>
                <div class="printrecord__description">
                  <span v-if="model.element_detail.external_protocol_id">
                    {{ $t('print_general_extern') + ': ' + model.element_detail.external_protocol_id }}
                  </span>
                  <span v-else>-</span>
                </div>
              </div>
              <div class="printrecord__card">
                <div class="printrecord__title">
                  {{ $t('record_card_state') }}
                </div>
                <div class="printrecord__description">
                  <span
                    :class="'badge badge-' + acronymUnderScored(model.record_state.acronym)">
                    {{ model.record_state.description }}
                  </span>
                </div>
              </div>
              <div class="printrecord__card">
                <div class="printrecord__title">
                  {{ $t('record_card_origin') }}
                </div>
                <div class="printrecord__description">
                  {{ model.page_origin ? model.page_origin : '' }}
                </div>
              </div>
              <div class="printrecord__card">
                <div class="printrecord__title">
                  {{ $t('record_card_support') }}
                </div>
                <div class="printrecord__description">
                  {{ model.support.description }}
                </div>
              </div>
              <div class="printrecord__card">
                <div class="printrecord__title">
                  {{ $t('record_card_group') }}
                </div>
                <div
                  v-if="model.responsible_profile"
                  class="printrecord__description"
                >
                  {{ model.responsible_profile.description }}
                </div>
                <div
                  v-if="!model.responsible_profile"
                  class="printrecord__description"
                >
                  -
                </div>
              </div>
              <div class="printrecord__card">
                <div class="printrecord__title">
                  {{ $t('record_card_creator') }}
                </div>
                <div class="printrecord__description">
                  {{ model.user_id }}
                </div>
              </div>
              <div class="printrecord__card">
                <div class="printrecord__title">
                  {{ $t('record_card_creator_profile') }}
                </div>
                <div class="printrecord__description">
                  {{ model.creation_group ? model.creation_group.description : $t('not_available') }}
                </div>
              </div>
              <div class="printrecord__card">
                <div class="printrecord__title">
                  {{ $t('record_card_register') }}
                </div>
                <div
                  v-if="model.registers.length"
                  class="printrecord__description"
                >
                  <span
                    v-for="register in model.registers"
                    :key="register.code"
                  >
                    {{ register.code }}
                  </span>
                </div>
                <div
                  v-else
                  class="printrecord__description"
                >
                  -
                </div>
              </div>
              <div
                v-if="model.communication_media"
                class="printrecord__card"
              >
                <div class="printrecord__title">
                  {{ $t('record_card_communication_media') }}
                </div>
                <div class="printrecord__description">
                  {{ model.communication_media.description }}
                </div>
              </div>
              <div
                v-if="model.communication_media_date"
                class="printrecord__card"
              >
                <div class="printrecord__title">
                  {{ $t('record_card_communication_media_date') }}
                </div>
                <div class="printrecord__description">
                  {{ model.communication_media_date | date }}
                </div>
              </div>
              <div class="col-lg-12 printrecord__card">
                <div class="printrecord__title">
                  {{ $t('record_card_related_record_cards') }}
                </div>
                <div class="printrecord__description">
                  -
                </div>
              </div>
              <div
                v-if="model.claims_number > 0"
                class="col-lg-12 printrecord__card">
                <div class="printrecord__title">
                  {{ $t('record_card_claims') }} ({{ model.claims_number }})
                </div>
                <div class="printrecord__description">
                  <record-card-claims :record="model" />
                </div>
              </div>
              <div class="printrecord__card">
                <div class="printrecord__title">
                  {{ $t('record_card_description') }}
                </div>
                <div class="printrecord__description">
                  {{ model.description }}
                </div>
              </div>
            </div>


            <template v-if="model.full_detail">
              <!-- Multirecords / Multifitxas -->
              <div
                v-if="model.is_multirecord || model.multirecord_from"
                class=""
              >
                <div class="printrecord__main-title">
                  <h3>{{ $t('multirecord') }}</h3>
                </div>
                <hr>
                <multi-record-list-print 
                  :record="model" 
                  @loadedComponent="loadComponent"
                  @mustTobeLoaded="componentsToBeLoaded" />
              </div>

              <!--Característiques / Atributes-->
              <record-attribute-values-print :record="model"/>

              <!-- External ids -->
              <div
                v-show="model.external_ids && model.external_ids.length > 0"
                class=" my-2">

                <div class="printrecord__main-title">
                  <h3>{{ $t('record_card_external_ids') }}</h3>
                </div>
                <hr>
                <div
                  v-for="external_id in model.external_ids"
                  :key="external_id.service_name"
                  class="printrecord__card"
                >
                  <div class="printrecord__title printrecord__title__big">
                    {{ external_id.service_name }}
                  </div>
                  <div class="printrecord__description">
                    {{ external_id.external_code }}
                  </div>
                </div>  
              </div>


              <!-- Ubication -->
              <div
                v-if="model.ubication">

                <div class="printrecord__main-title">
                  <h3>{{ $t('record_card_location') }}</h3>
                </div>
                <hr>
                <div class="printrecord__card">
                  <div class="printrecord__title">
                    {{ $t('record_card_district') }}
                  </div>
                  <div class="printrecord__description">
                    <model-from-id
                      :model-id="model.ubication.district"
                      model-attribute="name"
                      store-module="masters"
                      store-attribute="districts"
                      store-action="retrieveDistricts"
                    />
                  </div>
                </div>
                <div class="printrecord__card">
                  <div class="printrecord__title">
                    {{ $t('record_card_neighborhood') }}
                  </div>
                  <div class="printrecord__description">
                    {{ model.ubication.neighborhood }}
                  </div>
                </div>
                <div class="printrecord__card">
                  <div class="printrecord__title">
                    {{ $t('record_card_statistical_sector') }}
                  </div>
                  <div class="printrecord__description">
                    {{ model.ubication.statistical_sector }}
                  </div>
                </div>
                <div class="printrecord__card">
                  <div class="printrecord__title">
                    {{ $t('record_card_address') }}
                  </div>
                  <div class="printrecord__description">
                    {{ model.ubication.via_type }} {{ model.ubication.official_street_name || model.ubication.street }}
                  </div>
                </div>
                <div class="printrecord__card">
                  <div class="printrecord__title">
                    {{ $t('record_card_number_km_exit') }}
                  </div>
                  <div class="printrecord__description">
                    {{ model.ubication.street2 }}
                  </div>
                </div>
                <div class="printrecord__card">
                  <div class="printrecord__title">
                    {{ $t('record_card_stair') }}
                  </div>
                  <div class="printrecord__description">
                    {{ model.ubication.stair }}
                  </div>
                </div>
                <div class="printrecord__card">
                  <div class="printrecord__title">
                    {{ $t('record_card_floor') }}
                  </div>
                  <div class="printrecord__description">
                    {{ model.ubication.floor }}
                  </div>
                </div>
                <div class="printrecord__card">
                  <div class="printrecord__title">
                    {{ $t('record_card_door') }}
                  </div>
                  <div class="printrecord__description">
                    {{ model.ubication.door }}
                  </div>
                </div>
              </div>

            </template>

            <template v-if="model.full_detail">
              <!-- process -->
              <div v-if="model.workflow">
                <div class="printrecord__main-title">
                  <h3>{{ $t('record_card_process') }}</h3>
                </div>
                <hr>
                <process-print
                  :process="model"
                />
              </div>

              <!-- Files -->
              <div>
                <div class="printrecord__main-title">
                  <h3>{{ $t('record_card_files') }}</h3>
                </div>
                <hr>
                <files-print
                  :record-card="model"
                /> 
              </div>

              <!-- traceability -->
              <div>
                <div class="printrecord__main-title">
                  <h3>{{ $t('record_card_traceability') }}</h3>
                </div>
                <hr>
                <traceability-print
                  :model="model"
                  @loadedComponent="loadComponent"
                  @mustTobeLoaded="componentsToBeLoaded"
                />
              </div>

              <!-- Communications -->
              <div>
                <div class="printrecord__main-title">
                  <h3>{{ $t('comms_comms') }}</h3>
                </div>
                <hr>
                <communications-print
                  :record-card="model"
                  @loadedComponent="loadComponent"
                  @mustTobeLoaded="componentsToBeLoaded"
                />
              </div>

            </template>

          </div>
        </template>
      </detail>
    </printer>
  </span>
</template>


<script>
import Printer from '~/components/iris-pages/templates/Printer.vue'
import Detail from '~/components/pages/detail/Detail.vue'
import { get } from 'lodash'
import MultiRecordListPrint from '~/components/iris-pages/records/multirecord/MultiRecordListPrint.vue'
import ModelFromId from '~/components/tables/ModelFromId'
import FilesPrint from '~/components/iris-pages/records/files/FilesPrint.vue'
import TraceabilityPrint from '~/components/iris-pages/records/TraceabilityPrint'
import RecordAttributeValuesPrint from '~/components/iris-pages/records/detail/RecordAttributeValuesPrint'
import CommunicationsPrint from '~/components/iris-pages/records/communications/print/CommunicationsPrint'
import ProcessPrint from '~/components/iris-pages/records/ProcessPrint'
import Logo from '~/components/layout/Logo.vue'
import RecordCardClaims from '~/components/iris-pages/records/RecordCardClaims.vue'

export default {
  name: 'DetailRecordPrint',
  components: {
    Printer,
    Detail,
    MultiRecordListPrint,
    ModelFromId,
    FilesPrint,
    RecordCardClaims,
    TraceabilityPrint,
    RecordAttributeValuesPrint,
    CommunicationsPrint,
    ProcessPrint,
    Logo,
  },
  props: {
    idRecord: {
      type: Array,
      default: () => [],
    },
    dynamicClass: {
      type: String,
      default: '',
    },
  },
  data: function() {
    return {
      componentsLoaded: {},
      loadedAllComponents: false,
      cssToPrint: `
      .title-pdf {
        display: flex;
        justify-content: space-between;
        align-items: center;
        justify-items: center;
      }
      .title-pdf .title-pdf__logo,
      .title-pdf h2 {
        padding: 0px;
        margin: 0px;
      }
      .cardi__title {
        flex: auto !important;
        justify-content: flex-start;
        background-color: #ededed;
        font-weight: normal;
        width: 200px;
      }

      .cardi__description {
        all: none;
      }

      .printrecord {
        background-color: white;
        padding: 0.2rem;
      }
      .printrecord__card,
      .printrecord__card {
        display: flex;
      }
      .printrecord__title,
      .printrecord__description,
      .cardi__title,
      .cardi__description {
        display: flex;
        padding: 0.5rem 0.8rem;
        align-items: center;
      }
      .printrecord__description,
      .cardi__description {
        border: 1px solid #d4d4d4;
        display: flex;
        align-items: center;
      }
      .printrecord__title,
      .cardi__title {
        background-color: #f0f3f7;
        border: 1px solid #d4d4d4;
        width: 200px;
      }
      .printrecord__description {
        flex: 1 1 calc(100% - 175px);
        justify-content: flex-start;
        word-break: break-all;
      }
      .printrecord__main-title {
        background-color: #cbd3da;
        text-transform: uppercase;
        flex: 1 1 100%;
        margin-top: 100px;
      }
      .printrecord__firstTitle {
        margin-top: 25px;
      }
      .printrecord hr {
        display: block;
        height: 1px;
        border: 0;
        border-top: 1px solid rgb(32, 34, 36);
        margin: 1em 0;
        padding: 0;
      }
      /*CSS TABLES*/
      table {
        border-collapse: collapse;
        width: 100%;
      }
      th,
      td {
        padding: 8px;
        text-align: left;
        border-bottom: 1px solid #ddd;
      }
      /*CSS COMUNICATIONS*/
      converPrint .converPrint__paragraph {
        border-bottom: solid 1px;
        width: 50%;
        margin: 0px;
      }
      .chatMessages .chatMessages__box {
        border: solid 1px;
        margin: 5px;
        width: 50%;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        padding: 5px;
      }

      .chatMessages .chatMessages__box p {
        padding: 0;
        margin: 0;
      }

      .chatMessages .chatMessages__box .chatMessages__box__title,
      .chatMessages .chatMessages__box .chatMessages__box__data {
        align-self: flex-end;
      }
      // icnos
      .svg-inline--fa {
          display: none;
      }
      .fa-layers {
         display: none !important;
      }      
      /* Css for not showing the fisrt column for selectrin rows when the modal is open from the tab task 'tasques'*/
      .fromTask .VueTables__table > thead > tr > th:first-child {
        display: none;
      }
      .fromTask .VueTables__table > tbody > tr > td:first-child {
        display: none;
      }
    `,
    }
  },
  computed: {
    isLoadedComponents() {
      return this.loadedAllComponents
    },
  },
  created() {
    this.get = get
  },
  methods: {
    printContentPrinter() {
      this.$refs.printer.print()
    },
    acronymUnderScored(acronym) {
      const acronymUnderscored = acronym.replace(' ', '-')
      return acronymUnderscored.toLowerCase()
    },
    // set loadedAllComponents true or false if all components that have to load are loaded. if it's true the button 'imprimir' is enabled
    loadComponent(e) {
      this.componentsLoaded[e] = true

      this.loadedAllComponents = true
      Object.entries(this.componentsLoaded).map(com => {
        if (com[1] == false) {
          this.loadedAllComponents = false
        }
      })
    },
    // adding the components that have to be loaded dynamically
    componentsToBeLoaded(e) {
      this.componentsLoaded[e] = false
    },
  },
}
</script>

<style>
.title-pdf {
  display: flex;
  justify-content: space-between;
  align-items: center;
  justify-items: center;
}
.title-pdf .title-pdf__logo,
.title-pdf h2 {
  padding: 0px;
  margin: 0px;
}

.printrecord {
  background-color: white;
  padding: 0.2rem;
}
.printrecord__card,
.printrecord__card {
  display: flex;
}
.printrecord__title,
.printrecord__description {
  display: flex;
  padding: 0.5rem 0.8rem;
  align-items: center;
}
.printrecord__description {
  border: 1px solid #d4d4d4;
  display: flex;
  align-items: center;
}
.printrecord__title {
  background-color: #f0f3f7;
  border: 1px solid #d4d4d4;
  width: 200px;
}
.printrecord__description {
  flex: 1 1 calc(100% - 175px);
  justify-content: flex-start;
  word-break: break-all;
}
.printrecord__main-title {
  background-color: #cbd3da;
  text-transform: uppercase;
  flex: 1 1 100%;
  margin-top: 100px;
}
.printrecord__firstTitle {
  margin-top: 25px;
}
.printrecord hr {
  display: block;
  height: 1px;
  border: 0;
  border-top: 1px solid rgb(32, 34, 36);
  margin: 1em 0;
  padding: 0;
}
/* Css for not showing the fisrt column for selectrin rows when the modal is open from the tab task 'tasques'*/
.fromTask .VueTables__table > thead > tr > th:first-child {
  display: none;
}
.fromTask .VueTables__table > tbody > tr > td:first-child {
  display: none;
}
</style>
