<template>
  <div class="">
    <span class="input-group">
      <input
        v-model="innerValue"
        :required="schema.required"
        :readonly="schema.readonly"
        class="form-control">
      <div
        v-if="!schema.readonly"
        class="input-group-append">
        <button
          class="btn btn-primary"
          @click="open">{{ $t('search') }}</button>
      </div>
    </span>
    <b-modal
      ref="selector"
      :title="$t('register_selection')"
      :hide-footer="true"
      aria-describedby="modalDescription"
      role="alertdialog"
      size="xl"
    >
      <register-filters 
        :initial="listQuery" 
        @model-updated="setFilters" />
      <register-list
        v-if="listActive"
        ref="registerList"
        :query-params="listQuery"
        class="register-modal">
        <div
          slot="select"
          slot-scope="props">
          <button
            class="btn btn-primary"
            @click="selectFromList(props.row)">
            Seleccionar
          </button>
        </div>
      </register-list>
    </b-modal>
  </div>
</template>

<script>
import { abstractField } from 'vue-form-generator'
import RegisterList from './RegisterList.vue'
import RegisterFilters from './RegisterFilters.vue'
import Ariadna from '~/assets/js/iris2/model/Ariadna.js'
import { CancelToken } from 'axios'
import { mapMutations } from 'vuex'
import Applicant from '~/assets/js/iris2/model/Applicant.js'

/**
 * RecordCards can be related to entries from a document register. This component
 * allows to select a register code whether from a register list or by direct input.
 * The code introduced must exists in the DB.
 */
export default {
  name: 'RegisterSelector',
  components: {
    RegisterList,
    RegisterFilters,
  },
  extends: abstractField,
  data() {
    return {
      listActive: false,
      listQuery: { only_pending: true, used: 'False' },
      register: null,
      textValue: '',
      cancelToken: null,
      valid: false,
      loading: false,
    }
  },
  computed: {
    innerValue: {
      get() {
        return this.textValue
      },
      set(value) {
        this.valid = false
        if (Ariadna.validateCode(value)) {
          this.textValue = value.trim()
          if (this.register && this.register.code != value) {
            this.register = null
          }
          this.setOrLoadRegister()
        } else {
          this.value = null
          this.register = null
          this.$emit(
            'validated',
            false,
            [
              this.$t('register_enter_valid_code') +
                ' (' +
                Ariadna.ARIADNA_SAMPLE +
                ')',
            ],
            this
          )
        }
      },
    },
  },
  mounted() {
    if (this.value) {
      if (this.value.code) {
        this.textValue = this.value.code
      } else {
        this.innerValue = this.value
      }
    }
  },
  methods: {
    ...mapMutations('create', {
      setIssueText: 'setIssueText',
      setApplicantInitial: 'setApplicantInitial',
    }),
    open() {
      this.listActive = true
      this.$refs.selector.show()
    },
    select() {},
    close() {
      this.$refs.selector.hide()
    },
    setFilters(model) {
      this.listQuery = model
      this.$nextTick(() => {
        this.$refs.registerList.refresh()
      })
    },
    selectFromList(item) {
      this.register = item
      this.valid = true
      this.innerValue = item.code
      this.close()
    },
    setOrLoadRegister() {
      if (this.register) {
        this.setRegister(this.register)
      } else {
        this.loadRegister()
      }
    },
    setRegister(register) {
      this.$emit('validated', true, [], this)
      this.value = register
      this.setIssueText(register.issue)
      const [firstSurname, secondSurname] = register.applicant_surnames
        ? register.applicant_surnames.split('*')
        : ['', '']
      const isPerson = register.applicant_type == 'P'
      this.setApplicantInitial([
        register.applicant_doc,
        isPerson ? register.applicant_name : register.contact,
        isPerson ? firstSurname : register.social_reason,
        secondSurname,
        register.applicant_type,
        'ca',
        null,
        null,
        '',
        register.applicant_doc ? register.applicant_doc_type : Applicant.PASS,
        true,
      ])
    },
    loadRegister() {
      if (this.loading && this.cancelToken) {
        this.cancelToken.cancel()
      }
      this.cancelToken = CancelToken.source()
      this.setLoadingValidation()
      this.$axios
        .get('/api/ariadna/' + this.innerValue + '/', {
          cancelToken: this.cancelToken.token,
        })
        .then(resp => {
          this.valid = true
          this.register = resp.data
          this.setRegister({
            ...this.register,
            applicant_doc: this.register.applicant_doc || '',
          })
        })
        .catch(resp => {
          this.valid = false
        })
        .then(resp => {
          this.loading = false
        })
    },
    setLoadingValidation() {
      this.loading = true
      this.$emit(
        'validated',
        false,
        [this.$t('register_loading_validation')],
        this
      )
    },
  },
}
</script>

<style>
.register-modal .table-responsive {
  max-height: 320px;
  overflow: scroll;
}
</style>
