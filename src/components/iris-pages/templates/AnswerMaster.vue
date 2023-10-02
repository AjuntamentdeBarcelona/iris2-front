<template>
  <div
    ref="content"
    class="answer-master">
    <h3 class="h4">{{ $t('answer_master_select') }}</h3>
    <div
      v-if="answers.length == 0 && !loading"
      class="alert alert-warning">
      {{ $t('answer_master_select_empty') }}
    </div>
    <b-nav pills>
      <b-nav-item
        :disabled="!genericAnswers.length"
        :active="active == 0"
        @click="setActive(0)">Generals</b-nav-item>
      <b-nav-item
        :disabled="!groupAnswers.length"
        :active="active == 1"
        @click="setActive(1)">Pròpies del grup</b-nav-item>
    </b-nav>
    <div class="row answers">
      <div
        v-for="answer in selectedAnswers"
        :key="answer.id"
        :class="{'is-own': answer.is_own, 'is_group': answer.is_group}"
        class="answer col-12">
        <vue-editor
          v-model="answer.text"
          :editor-toolbar="[]"
          :editor-options="[]"
          disabled
          class="form-control" />
        <strong :class="{'badge badge-warning': answer.is_own}">{{ answer.label }}</strong>
        <span v-if="!answer.label">{{ answer.description }}</span>
        <dynamic-tag-modal
          v-if="canAdminTemplates && answer.is_group && !loading"
          :ref="'modal_' + answer.id"
          :component-props="{variant:'btn-outline-secondary'}"
          :show-scroll="true"
          class="btn btn-outline-secondary"
          width="80%"
        >
          {{ $t('form_edit') }}
          <font-awesome-icon icon="save"/>
          <template slot="modal">
            <group-template-form
              :record="record"
              :initial="answer"
              :template="answer"
              :text-attribute="answer.text_attribute"
              @form-saved="closeModal(answer)" />
          </template>
        </dynamic-tag-modal>
        <button
          class="btn btn-outline-secondary float-right"
          @click="select(answer)">
          {{ $t('select') }}
          <font-awesome-icon icon="forward"/>
        </button>
      </div>
    </div>

    <div
      v-show="!answers.length"
      class="alert alert-info">
      {{ $t('answer_templates_empty') }}
    </div>
  </div>
</template>

<script>
import List from '~/components/pages/list/List.vue'
import _ from 'lodash'
import { mapGetters } from 'vuex'
import Permissions from '~/assets/js/iris2/Permissions.js'
import DeleteButton from '~/components/pages/actions/DeleteButton.vue'
import DynamicTagModal from '~/components/pages/actions/DynamicTagModal'
import GroupTemplateForm from '~/components/iris-pages/templates/GroupTemplateForm.vue'
import { VueEditor } from 'vue2-editor'

export default {
  name: 'AnswerMaster',
  components: {
    DynamicTagModal,
    GroupTemplateForm,
    VueEditor,
  },
  extends: List,
  props: {
    url: {
      type: String,
      default: '/api/templates/record-card/',
    },
    record: {
      type: Object,
      required: true,
    },
  },
  data() {
    return { active: 0 }
  },
  computed: {
    canAdminTemplates() {
      return this.hasPermission(Permissions.TEMPLATE.GROUP_ADMIN)
    },
    ...mapGetters('groups', { hasPermission: 'hasPermission' }),
    selectedAnswers() {
      return this.active == 1 ? this.groupAnswers : this.genericAnswers
    },
    groupAnswers() {
      return this.answers.filter(item => item.is_group)
    },
    genericAnswers() {
      return this.answers.filter(item => !item.is_group)
    },
    answers() {
      const order = ['order', 'response_type']
      return _.sortBy(
        this.items
          .map(item => this.addLabel(item))
          .filter(item => item.text.trim() != ''),
        order,
        ['asc', 'asc']
      )
    },
  },
  methods: {
    afterLoad() {
      if (this.genericAnswers.length == 0) {
        this.active = 1
      }
      const def = this.answers.find(item => item.is_default)
      if (def) {
        this.$emit('default-found', def)
      }
    },
    addLabel(item) {
      return {
        ...item,
        order: item.is_own ? 0 : 1,
        label: item.is_own
          ? this.$t('answer_master_own_answer')
          : item.response_type,
      }
    },
    getUrl() {
      return `${this.url}${this.record.id}/`
    },
    select(answer) {
      this.$emit('selected-text', answer.original_text)
      this.$emit('selected-template-text', answer)
    },
    setActive(tab) {
      this.active = tab
    },
    closeModal(answer) {
      this.items = []
      this.refresh()
    },
  },
}
</script>

<style lang="scss">
.answer-master {
  min-height: 80%;
  .answers {
    margin-top: 20px;
    min-height: 200px;
  }
  .answer {
    padding-bottom: 40px;
    flex-grow: 1;
    &.is-own {
      strong {
        font-size: 1.02em;
      }
    }
    button: {
      margin-left: 5px;
    }
    strong {
      margin-bottom: 10px;
    }
    .quillWrapper.form-control {
      height: 200px;
      padding: 0px;
      margin-bottom: 10px;
      .ql-toolbar {
        display: none;
      }
      .ql-container {
        border-top: 1px solid #ccc;
      }
    }
    textarea {
      min-height: 100px;
      padding: 10px;
    }
  }
}
</style>
