<script>
import FormDefinition from '~/assets/js/forms/formDefinition'
import SchemaForm from '~/components/pages/form/schemaForm'
import { mapActions } from 'vuex'

function getSetApplicantForm(vm) {
  return new FormDefinition(
    {
      applicant: {
        uid: 'applicant-selector',
        type: 'applicant-selector',
        styleClasses: 'col-12 record-set-applicant',
        citizenSelector: true,
      },
    },
    {
      groups: [
        {
          fields: ['applicant'],
        },
      ],
    }
  )
}
export default {
  extends: SchemaForm,
  props: {
    formType: {
      type: String,
      default: 'create',
    },
    title: {
      type: String,
      default: 'record_card_applicant_set',
    },
    definition: {
      type: Function,
      default: getSetApplicantForm,
    },
    record: {
      type: Object,
      default() {
        return {}
      },
      required: true,
    },
  },
  computed: {},
  watch: {
    record: {
      handler() {
        this.overrideDetail(this.record.element_detail)
        this.newChannel(this.record.input_channel)
        this.newApplicantType(this.record.applicantType)
      },
      immediate: true,
    },
  },
  methods: {
    getInitial() {
      return {
        support_id: this.record.support,
        input_channel: this.record.input_channel,
        element_detail_id: this.record.element_detail,
      }
    },
    getRequestUrl() {
      return this.record.actions['set_applicant'].action_url
    },
    getDefaultButtons() {
      return [
        {
          name: 'search',
          text: this.$t('record_card_applicant_set_and_solve'),
          click: this.submit,
          icon: 'search',
          classes: 'btn-primary ml-auto',
        },
      ]
    },
    ...mapActions('create', [
      'overrideDetail',
      'newChannel',
      'newApplicantType',
    ]),
  },
}
</script>
<style lang="scss">
.vue-form-generator {
  .record-set-applicant {
    margin-bottom: 0px !important;
    padding-bottom: 15px;
    .applicantSearch {
      margin-top: -20px;
      margin-bottom: -20px;
    }
    .table-list.irisbox {
      padding: 10px 5px 0px 5px;
      .VueTables {
        border: 0px;
        padding: 2px;
        margin-bottom: 0px;
        .table {
          margin-bottom: 5px;
        }
      }
      .VuePagination {
        display: none;
      }
    }
  }
}
</style>
