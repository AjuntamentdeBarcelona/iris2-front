<template>
  <div class="table-list table-template-list">
    <header class="contentwrapper__header">
      <h1 class="title-line">{{ $t('templates_title') }}</h1>
    </header>
    <div class="blocktable">
      <div
        v-if="loading"
        class="loading-overlay">
        <div class="loader" />
      </div>
      <table
        class="table-templates">
        <thead>
          <tr>
            <th>
              <input
                v-model="internalSearch"
                :placeholder="$t('template_answer_type_search')"
                type="text"
                class="form-control record-type-search"
                @input="debouncedSearch">
            </th>
            <th
              v-for="rType in recordTypes"
              :key="rType.id">
              {{ rType.description }}
              <nuxt-link
                :to="getTypeEditUrl(rType)"
                class="btn btn-sm btn-outline-secondary"
              >
                <font-awesome-icon icon="edit" />
              </nuxt-link>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="ans in answerTypes"
            :key="ans.id">
            <td class="p-2 text-primary">
              {{ ans.description }}
              <nuxt-link
                :to="getAnswerTypeEditUrl(ans)"
                class="btn btn-sm btn-outline-secondary"
              >
                <font-awesome-icon icon="edit" />
              </nuxt-link>
              <delete-button
                :object="ans"
                :url="answerTypeUrl"
                @deleted="answerTypeDeleted" />
            </td>
            <td
              v-for="rType in recordTypes"
              :key="rType.id">
              <template-item
                :item="getItem(rType, ans)"
                @assign="assign(rType, ans)"
                @selected="select(rType, ans)"/>
            </td>
          </tr>
          <tr>
            <td class="p-2 text-primary">
              <nuxt-link
                :to="answerTypeCreate"
                class="btn btn-sm btn-outline-secondary"
              >
                <font-awesome-icon icon="plus" />
                {{ $t('response_type_add') }}
              </nuxt-link>
            </td>
            <td
              v-for="rType in recordTypes"
              :key="rType.id"/>
          </tr>
        </tbody>
      </table>
      <template-assignation-modal
        ref="assign"
        @ready="load" />
    </div>
  </div>
</template>

<script>
import TemplateAssignationModal from './TemplateAssignationModal.vue'
import TemplateItem from './TemplateItem.vue'
import DeleteButton from '~/components/pages/actions/DeleteButton.vue'
import { mapActions, mapState, mapGetters } from 'vuex'
import _ from 'lodash'
import trimAccents from '~/assets/js/utils/string/trimAccents.js'

/**
 * CASOS
 *
 * CARGAMOS LOS 3 A LA VEZ
 */
export default {
  name: 'TemplateTable',
  components: {
    TemplateItem,
    TemplateAssignationModal,
    DeleteButton,
  },
  props: {
    answerTypeUrl: {
      type: String,
      default: '/api/templates/response_types/',
      required: false,
    },
    templatesUrl: {
      type: String,
      default: '/api/templates/templates/',
      required: false,
    },
  },
  data() {
    return {
      loading: false,
      error: false,
      templateMatrix: {},
      internalSearch: '',
      searchText: '',
    }
  },
  computed: {
    answerTypeCreate() {
      return this.localePath({
        name: 'backoffice-admin-records-templates-answer-types-add',
      })
    },
    trimmedSearch() {
      return trimAccents(this.searchText.trim().toLowerCase())
    },
    answerTypes() {
      let list = [...this.allAnswerTypes]
      if (this.trimmedSearch) {
        list = list.filter(item => {
          return (
            trimAccents(item.description.toLowerCase()).indexOf(
              this.trimmedSearch
            ) >= 0
          )
        })
      }
      return _.sortBy(list, ['description'])
    },
    ...mapState('masters', { recordTypes: 'recordTypes' }),
    ...mapState('templates', { allAnswerTypes: 'answerTypes' }),
    ...mapGetters('templates', {
      templates: 'getTemplates',
      templateError: 'hasError',
    }),
  },
  created() {
    this.debouncedSearch = _.debounce(this.setSearch, 300)
    this.load()
  },
  methods: {
    ...mapActions('masters', { loadRecordTypes: 'retrieveRecordTypes' }),
    ...mapActions('templates', {
      loadAnswerTypes: 'retrieveAnswerTypes',
      loadTemplates: 'retrieveTemplates',
    }),
    setSearch() {
      this.searchText = this.internalSearch
    },
    load() {
      this.loading = true
      Promise.all([
        this.loadAnswerTypes(),
        this.loadTemplates(),
        this.loadRecordTypes(),
      ])
        .then(() => {
          this.classifyTemplates()
        })
        .catch(e => {
          this.error = true
        })
        .then(() => {
          this.loading = false
        })
    },
    /**
     * Classifies in two indexed objects by record type and answer type. The final matrix
     * is a convenient way of checking if a record type has a template for an answer type,
     * and generate the table easily.
     *
     * @returns {Object} Object with templates indexed by record type and then by answer.
     */
    classifyTemplates() {
      if (this.answerTypes.length) {
        const emptyAnswers = Object.assign.apply(
          {},
          this.answerTypes.map(item => {
            return { [item.id]: null }
          })
        )
        let matrix = Object.assign.apply(
          {},
          this.recordTypes.map(item => {
            return { [item.id]: { ...emptyAnswers } }
          })
        )
        for (let template of this.templates) {
          for (let rType of template.record_types) {
            matrix[rType.record_type][template.response_type_id] = template
          }
        }
        this.templateMatrix = matrix
      }
    },
    getItem(recordType, answerType) {
      return _.get(
        _.get(this.templateMatrix, recordType.id, {}),
        answerType.id,
        null
      )
    },
    assign(recordType, answerType) {
      this.$refs.assign.open(recordType, answerType)
    },
    select(recordType, answerType) {
      this.$refs.assign.open(
        recordType,
        answerType,
        this.getItem(recordType, answerType)
      )
    },
    /**
     * @param {Object} RecordType instance.
     * @returns {Object} Generates the url for the Record Type edit page.
     */
    getTypeEditUrl(recordType) {
      return this.localePath({
        name: 'backoffice-admin-records-templates-record-types-id',
        params: { id: recordType.id },
      })
    },
    /**
     * @param {Object} AnswerType instance.
     * @returns {Object} Generates the url for the Answer Type edit page.
     */
    getAnswerTypeEditUrl(answerType) {
      return this.localePath({
        name: 'backoffice-admin-records-templates-answer-types-id',
        params: { id: answerType.id },
      })
    },
    /**
     * Remove the answer type from the list if deleted.
     */
    answerTypeDeleted(answerType) {
      this.answerTypes = this.answerTypes.filter(
        item => item.id != answerType.id
      )
    },
  },
}
</script>

<style lang="scss">
.table-template-list > .irisbox {
  min-height: 200px;
}

.table-templates {
  min-width: 1000px;
  table-layout: fixed;
  width: 100%;
  .btn {
    padding: 0.3em 0.7em;
  }
  th {
    font-size: 1.15rem;
    color: $primary;
    text-align: center;
    padding: 0.6rem;
  }
  td,
  th {
    border: 2px solid $light;
    .record-type-search {
      padding: 5px;
    }
  }
  .template {
    background-color: transparent;
    cursor: pointer;
    border: none;
    display: flex;
    flex-wrap: wrap;
    text-align: center;
    font-size: 0.8rem;
    padding: 0.5rem;
    width: 100%;
    // template__name
    &__name {
      color: $dark;
      flex: 0 1 100%;
      font-size: 0.8em;
    }
    // template-service
    &-service {
      flex: 0 1 50%;
      font-size: 1.1em;
      text-transform: uppercase;

      // template-service__name
      &__name {
        color: $primary;
        font-weight: 600;
      }
      // template-service__language
      &__language {
        font-size: 0.7em;
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        justify-content: center;
        margin: 0 -0.25rem;
        li {
          padding: 0.75em;
          opacity: 0.7;
        }
      }
    }
    &__new {
      color: $primary;
      flex: 0 1 100%;
      font-size: 4em;
      text-align: center;
      line-height: 1;
      transform: scale(0.8);
      transition: transform 0.3s ease-in-out;
    }
  }

  // ACTIVATION ON HOVER/FOCUS/ACTIVE
  .template:hover,
  .template:active,
  .template:focus {
    .template {
      &__new {
        transform: scale(1);
      }
    }
  }

  // DISABLED
  .template-service {
    .template-disabled {
      font-weight: bolder;
      color: $danger;
      opacity: 1;
    }
    &__name {
      &.template-disabled {
        font-weight: bolder;
        color: $danger;
        opacity: 1;
      }
    }
  }
}
.blocktable {
  overflow: scroll;
}
</style>
