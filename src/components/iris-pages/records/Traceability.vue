<template>
  <loader v-if="!ready"/>
  <b-tabs
    v-else
    class="w-100"
  >
    <b-tab
      v-for="(categoryData, key) in tableData"
      :key="key"
      :title="categoryData.title"
      title-link-class="rounded-0"
    >
      <traceability-table
        ref="table"
        :prop-data="categoryData.data"
      />
    </b-tab>
  </b-tabs>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { modelFromId, sortDataByDate } from '~/assets/js/helpers'
import ReasonType from '~/assets/js/iris2/model/ReasonType'
import Loader from '~/components/utils/Loader'
import { iconMap as alarmIconMap } from '~/components/tables/columns/RecordCardAlarms'
import TraceabilityTable from '~/components/iris-pages/records/TraceabilityTable'
import moment from 'moment'

const traceabilityIconMap = {
  state_history: [{ icon: 'fas fa-redo' }],
  worflow_comment: [
    { icon: 'fas fa-comment' },
    { icon: 'fas fa-code-branch', class: 'text-white' },
  ],
  reasignation: [{ icon: 'fas fa-share' }],
  record_comment: {
    simple: [{ icon: 'fas fa-comment' }],
    reason: {
      // Citizen claim comment
      6: [
        { icon: 'fas fa-comment' },
        { icon: 'fas fa-bolt', class: 'text-white' },
      ],
      // RecordCard urgency
      100: [
        { icon: 'fas fa-comment' },
        {
          icon: 'fas fa-exclamation',
          class: 'text-white',
        },
      ],
      // RecordCard block
      200: [
        { icon: 'fas fa-comment' },
        { icon: 'fas fa-lock', class: 'text-white' },
      ],
      // Cancel request comment
      1000: [
        { icon: 'fas fa-comment' },
        { icon: 'fas fa-times', class: 'text-white' },
      ],
      1600: [
        { icon: 'fas fa-comment' },
        { icon: 'fas fa-at', class: 'text-white' },
      ],
      reassignation: [{ icon: 'fas fa-share' }],
    },
  },
}

// Mapped from src/iris_masters/models.py Reason
const reasonMap = {
  CITIZEN_REQUEST: 6,
  RECORDCARD_URGENCY_CHANGE: 100,
  RECORDCARD_BLOCK_CHANGE: 200,
  RECORDCARD_CANCEL_REQUEST: 1000,
  COPY_FILES: 1301,
  INITIAL_DERIVATION: 1299,
  RECORDCARD_INVALID_MAIL: 1600,
}

const CUSTOM_REASON = {
  997: 'record_card_traceability_no_send',
}

const reasonList = Object.values(reasonMap)

/**
 * Elaborates three lists to feed three different tables: Alarms, Process and Audit
 */
export default {
  name: 'Traceability',
  components: {
    Loader,
    TraceabilityTable,
  },
  props: {
    model: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      traceability: [],
      tableData: {
        audit: { title: this.$t('traceability_audit'), data: [] },
        alarms: { title: this.$t('traceability_alarms'), data: [] },
        workflow: { title: this.$t('traceability_workflow'), data: [] },
      },
      ready: false,
    }
  },
  computed: {
    ...mapState('masters', ['states', 'reasons']),
  },
  async created() {
    await this.retrieveReasons()
    this.mapCancelationReasons()
    await this.retrieveStates()
    await this.loadTraceability()
    this.generateTableData()
  },
  methods: {
    async loadTraceability() {
      try {
        const response = await this.$axios.get(this.getRequestURL())
        this.traceability = response.data
      } catch {
        // TODO: Request error handling
        console.log('Traceability Load Error')
      }
    },
    generateTableData() {
      const traceability = this.categorizeTraceability()

      // Traceability endpoint categorized data
      const stateHistoryEntries = traceability['state_history'] || []
      const worflowCommentEntries = traceability['worflow_comment'] || []
      const reassignmentEntries = traceability['reasignation'] || []
      const recordCommentEntries = traceability['record_comment'] || []

      const urgentComments = recordCommentEntries.filter(
        e => e.reason === reasonMap.RECORDCARD_URGENCY_CHANGE
      )
      const cancelRequestComments = recordCommentEntries.filter(
        e => e.reason === reasonMap.RECORDCARD_CANCEL_REQUEST
      )
      const claimComments = recordCommentEntries.filter(
        e => e.reason === reasonMap.CITIZEN_REQUEST
      )
      const blockComments = recordCommentEntries.filter(
        e => e.reason === reasonMap.RECORDCARD_BLOCK_CHANGE
      )
      const fileComments = recordCommentEntries.filter(
        e => e.reason === reasonMap.COPY_FILES
      )
      if (fileComments.length > 0) {
        this.$emit('pending-files')
      }
      const invalidEmailComments = recordCommentEntries.filter(
        e => e.reason === reasonMap.RECORDCARD_INVALID_MAIL
      )
      const simpleComments = recordCommentEntries.filter(e => e.reason === null)
      const unmappedReasonComments = recordCommentEntries.filter(
        e => !reasonList.includes(e.reason) && e.reason !== null
      )
      const claimCommentsWeb = claimComments.filter(c => !c.user_id)
      const claimCommentsBackoffice = claimComments.filter(c => c.user_id)

      const urgentLatest = this.getLatestEntry(urgentComments)
      const urgentRest = this.getRemainingEntries(urgentComments)
      const urgentAlarm =
        this.model.urgent && urgentLatest ? urgentLatest : null
      const urgentRestAudit = this.model.urgent ? urgentRest : urgentComments
      const cancelRequestLatest = this.getLatestEntry(cancelRequestComments)
      const cancelRequestRest = this.getRemainingEntries(cancelRequestComments)
      const claimCommentsWebLatest = this.getLatestEntry(claimCommentsWeb)
      const claimCommentsWebRest = this.getRemainingEntries(claimCommentsWeb)
      const claimCommentsBackofficeLatest = this.getLatestEntry(
        claimCommentsBackoffice
      )
      const claimCommentsBackofficeRest = this.getRemainingEntries(
        claimCommentsBackoffice
      )
      const reassignmentLatest = this.getLatestEntry(
        reassignmentEntries.filter(item => !!item.user_id)
      )
      // Hide initial derivation created auto
      const reassignmentRest = reassignmentEntries.filter(
        item => item.reason != reasonMap.INITIAL_DERIVATION
      )
      const invalidEmailCommentLatest = this.getLatestEntry(
        invalidEmailComments
      )
      const invalidEmailCommentRest = this.getRemainingEntries(
        invalidEmailComments
      )
      const commentlessAlarms = this.getCommentlessAlarms()

      // Alarms
      let alarms = []
      if (urgentAlarm) alarms.push(urgentAlarm)
      if (cancelRequestLatest) alarms.push(cancelRequestLatest)
      if (claimCommentsWebLatest) alarms.push(claimCommentsWebLatest)
      if (claimCommentsBackofficeLatest)
        alarms.push(claimCommentsBackofficeLatest)
      if (reassignmentLatest) alarms.push(reassignmentLatest)
      if (invalidEmailCommentLatest) alarms.push(invalidEmailCommentLatest)
      alarms.push(...commentlessAlarms)

      alarms = sortDataByDate(alarms, 'created_at')
      this.tableData.alarms.data = this.processTraceabilityData(alarms)

      // Workflow
      let workflow = []
      workflow.push(...worflowCommentEntries)
      workflow.push(...stateHistoryEntries)
      workflow.push(...simpleComments)

      workflow = sortDataByDate(workflow, 'created_at')
      this.tableData.workflow.data = this.processTraceabilityData(workflow)

      // Audit
      let audit = []
      audit.push(...urgentRestAudit)
      audit.push(...claimCommentsWebRest)
      audit.push(...claimCommentsBackofficeRest)
      audit.push(...blockComments)
      audit.push(...cancelRequestRest)
      audit.push(...reassignmentRest)
      audit.push(...unmappedReasonComments)
      audit.push(...invalidEmailCommentRest)

      audit = sortDataByDate(audit, 'created_at')
      this.tableData.audit.data = this.processTraceabilityData(audit)

      this.ready = true
    },
    processTraceabilityData(data) {
      data.forEach((obj, ind, arr) => {
        if (!obj.alarm) {
          let event_detail = {}
          const reason =
            obj.reason !== null
              ? modelFromId(obj.reason, this.reasons, 'description') || null
              : null

          switch (obj.type) {
            case 'state_history': // previous_state, next_state
              const prevState = modelFromId(
                obj.previous_state,
                this.states,
                'description'
              )
              const nextState = modelFromId(
                obj.next_state,
                this.states,
                'description'
              )
              if (prevState != nextState) {
                event_detail = {
                  text: this.$t('traceability_state', { prevState, nextState }),
                }
              } else {
                event_detail = {
                  text: this.$t('traceability_state', { prevState, nextState }),
                }
              }
              break

            case 'worflow_comment': // comment, task
              event_detail = {
                text: `${obj.task}: ${obj.comment}`,
              }
              break

            case 'reasignation': // comment, reason, previous_responsible, next_responsible
              const text = this.$t('traceability_reassign', obj)
              if (obj.comment.trim() == '') {
                this.checkMergeFromIRISI1(obj, ind, arr)
              }
              event_detail = {
                text:
                  reason !== null
                    ? `${text} (${reason}): ${obj.comment}`
                    : `${text}: ${obj.comment}`,
              }
              break

            case 'record_comment': // comment, (reason)
              event_detail = {
                text: this.getComment(obj, reason),
              }
              break
          }

          arr[ind].event_detail = event_detail

          /*
         * Logic:
         * -For alarms, uses RecordCardAlarm's iconMap
         * -For specific types, uses it's respective mapping
         * -For generic comments, uses it's reason mapping if it exists, else the generic comment icon
         */
          arr[ind].icons =
            obj.type !== 'record_comment'
              ? traceabilityIconMap[obj.type]
              : obj.reason !== null
                ? traceabilityIconMap[obj.type].reason[obj.reason] ||
                  traceabilityIconMap[obj.type].simple
                : traceabilityIconMap[obj.type].simple
        }
      })

      return data.filter(v => !v.hide)
    },
    categorizeTraceability() {
      const reducer = (accumulator, currentValue) => {
        accumulator[currentValue.type]
          ? accumulator[currentValue.type].push(currentValue)
          : (accumulator[currentValue.type] = [currentValue])

        return accumulator
      }

      return this.traceability.reduce(reducer, {})
    },
    /**
     * Generates comments for alarms that don't leave one already
     */
    getCommentlessAlarms() {
      const commentlessAlarmsKeys = [
        'mayorship',
        'possible_similar_records',
        'citizen_claim',
        'citizen_web_claim',
        'pend_citizen_response',
        'pend_response_responsible',
        'citizen_response',
        'response_to_responsible',
        'response_time_expired',
        'related_records',
      ]

      const commentlessAlarms = []

      for (const alarm in this.model.alarms) {
        if (
          alarm &&
          this.model.alarms[alarm] &&
          commentlessAlarmsKeys.includes(alarm)
        ) {
          commentlessAlarms.push({
            alarm: alarm,
            icons: alarmIconMap(this)[alarm],
            event_detail: {
              text: `${alarmIconMap(this)[alarm][0].title}: ${
                alarmIconMap(this)[alarm][0].legend
              }`,
            },
          })
        }
      }

      return commentlessAlarms.slice()
    },
    mapCancelationReasons() {
      // Dinamically add cancellation reasons to the traceabilityIconMap and assign them the already declared
      // cancellation icon from traceabilityIconMap.record_comment.reason if available, or else a generic one
      const cancellationReasons = this.reasons
        .filter(reason => reason.reason_type == ReasonType.CANCELLATION)
        .map(reason => Number(reason.id))

      cancellationReasons.forEach(reason => {
        const iconMapEntry = traceabilityIconMap.record_comment.reason[reason]

        if (iconMapEntry === undefined) {
          traceabilityIconMap.record_comment.reason[reason] = [
            { icon: 'fas fa-times' },
          ]
        }
      })
    },
    getLatestEntry(entries) {
      const sortedEntries = sortDataByDate(entries, 'created_at')
      return sortedEntries[0]
    },
    getRemainingEntries(entries) {
      const sortedEntries = sortDataByDate(entries, 'created_at')
      return sortedEntries.slice(1)
    },
    async refresh() {
      await this.loadTraceability()
      this.generateTableData()

      if (this.$refs.table) {
        this.$refs.table.forEach(table => {
          table.refresh()
        })
      }
    },
    /**
     * Method for merging comments from IRIS1 if they exists.
     * IRIS1 reassignation comments migrated were splited in two parts,
     * this method merges them for a better user experience.
     */
    checkMergeFromIRISI1(reas, ind, arr) {
      if (ind > 0 && this.mergeReassignationFromIRIS1(reas, arr[ind - 1])) {
        return
      }
      if (ind + 1 < arr.length) {
        this.mergeReassignationFromIRIS1(reas, arr[ind + 1])
      }
    },
    mergeReassignationFromIRIS1(reas, comment) {
      if (comment.type !== 'record_comment') {
        return
      }
      const maxDiff = 2000
      const timeDiff = moment(comment.created_at).diff(moment(reas.created_at))
      if (Math.abs(timeDiff) < maxDiff && comment.reason === reas.reason) {
        reas.hide = true
        // Split comment
        reas.comment = comment.comment
        comment.reason = 'reassignation'
        comment.icons = traceabilityIconMap[comment.type].reason[comment.reason]
      }
    },
    getRequestURL() {
      return `/api/record_cards/record_cards/${this.model.id}/traceability/`
    },
    getComment(obj, reason) {
      if (obj.reason && CUSTOM_REASON[obj.reason]) {
        return (
          `${reason}: ` +
          this.$t(CUSTOM_REASON[obj.reason]).replace('${comment}', obj.comment)
        )
      }
      return reason !== null ? `${reason}: ${obj.comment}` : obj.comment
    },
    ...mapActions('masters', ['retrieveReasons', 'retrieveStates']),
  },
}
</script>
