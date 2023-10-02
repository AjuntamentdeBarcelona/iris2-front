<template>
  <div
    v-if="actionsPath.length > 0"
    class="record-card-process">
    <div v-if="process.workflow.records.length > 1">
      <h4>{{ $t('unirecord_records') }}</h4>
      <table>
        <tr>
          <th>{{ $t('record_card_normalized_record_id') }}</th>
          <th>{{ $t('description') }}</th>
          <th>{{ $t('record_card_start_state') }}</th>
        </tr>
        <tr 
          v-for="record in process.workflow.records" 
          :key="record.id">
          <td>{{ record.normalized_record_id }}</td>
          <td>{{ record.description }}</td>
          <td>{{ dateStr(record.created_at) }}</td>
        </tr>
      </table>
      <br>
    </div>
    <div 
      v-for="step in actionsPath"
      :key="step.transition"
      :disabled="!step.active && !step.ready">
      <h4>{{ $t(step.title) }}</h4>
      <component
        :is="step.component"
        :process="process"
        :detail="process.element_detail"
        :step="step"
        :read-only="!step.active || isClosed || isLocked || !hasPermissionsForCurrent"
        @form-saved="actionCompleted"
      />
      <br>
    </div>
  </div>
</template>


<script>
import RecordState from '~/assets/js/iris2/model/RecordState.js'
import PlanPrint from './process/PlanPrint.vue'
import ResolutionPrint from './process/ResolutionPrint.vue'
import ProcessAnswersPrint from './process/ProcessAnswersPrint.vue'
import ExternalProcessingPrint from './process/ExternalProcessingPrint.vue'
import IdealPath from './IdealPath.vue'
import UnirecordTable from './UnirecordTable.vue'
import RequireThemeChangeVue from './process/RequireThemeChange.vue'
import { dateTime } from '~/assets/js/helpers.js'

const transitionComponents = {
  [RecordState.PENDING_PLAN.transition]: PlanPrint,
  [RecordState.PENDING_RESOLUTION.transition]: ResolutionPrint,
  [RecordState.PENDING_ANSWER.transition]: ProcessAnswersPrint,
  [RecordState.EXTERNAL_PROCESSING.transition]: ExternalProcessingPrint,
}

export default {
  name: 'Process',
  components: {
    IdealPath,
    UnirecordTable,
  },
  props: {
    /**
     * Process object with at least three properties:
     * - ideal_path
     * - actions
     * - current_step
     * - element_detail
     */
    process: {
      type: Object,
      required: true,
    },
    canManage: {
      type: Boolean,
      default: true,
      required: false,
    },
  },
  data() {
    return {
      componentsLoaded: {},
    }
  },
  computed: {
    /**
     * RecordCard locked by another user
     */
    isLocked() {
      return (
        !this.canManage ||
        (this.process.blocked &&
          this.process.blocked.blocked &&
          this.process.blocked.user_id !== this.$auth.$state.user)
      )
    },
    /**
     * @todo review for process
     */
    isClosed() {
      return this.process.record_state_id == RecordState.CLOSED.id
    },
    /**
     * @return {Array} Ideal path of state transitions
     */
    idealPath() {
      return RecordState.expandIdealPath(
        this.process.ideal_path,
        this.process.current_step
      )
    },
    currentStep() {
      const activeSteps = this.idealPath.filter(step => step.active)
      return activeSteps.length > 0 ? activeSteps[0] : null
    },
    hasPermissionsForCurrent() {
      if (this.currentStep) {
        const action = this.currentStep.transition
        const draftAction = this.currentStep['draft-transition']
        return (
          _.get(this.process.actions[action], 'can_perform', false) ||
          _.get(this.process.actions[draftAction], 'can_perform', false)
        )
      }
      return false
    },
    /**
     * @return {Number} Index of the current step
     */
    indexOfCurrent() {
      const current =
        this.process.current_step == 'pending_answer'
          ? 'answer'
          : this.process.current_step
      if (!this.isClosed) {
        return this.actionsPath.findIndex(item => {
          return item.transition == current
        })
      }
      return this.actionsPath.length
    },
    /**
     * @return {Array} RecordStates with a valid component for performing actions.
     */
    actionsPath() {
      return this.idealPath
        .filter(step => transitionComponents[step.transition] != null)
        .map(step => {
          return {
            ...step,
            component: _.get(
              this.process.actions[step.transition],
              'must_change_theme',
              false
            )
              ? RequireThemeChangeVue
              : transitionComponents[step.transition],
          }
        })
    },
  },
  watch: {
    actionsPath: {
      handler() {
        if (this.actionsPath.length == 0) {
          this.$emit('empty-process')
        }
      },
      immediate: true,
    },
  },
  methods: {
    getTabIcon(step) {
      if (step.ready || this.isClosed) {
        return 'check'
      } else if (step.active) {
        return 'tasks'
      } else {
        return ''
      }
    },
    actionCompleted() {
      this.$emit('state-changed', this.process)
    },
    dateStr(data) {
      if (!data) {
        return '-'
      }
      try {
        return `${dateTime(data)}`
      } catch (e) {
        return '-'
      }
    },
    loadComponent(e) {
      this.componentsLoaded[e] = true

      this.loadedAllComponents = true
      Object.entries(this.componentsLoaded).map(com => {
        if (com[1] == false) {
          this.loadedAllComponents = false
        }
      })
    },
    componentsToBeLoaded(e) {
      this.componentsLoaded[e] = false
    },
  },
}
</script>

<style lang="scss">
.record-card-process {
  width: 100%;
  .form-page-form {
    border: none;
  }
  .tab-pane {
    min-height: 300px;
    /* min-width: 800px; */
  }
  .process-unirecord {
    .VueTables {
      padding: 1rem;
    }
  }
}
</style>

<style lang="scss" scoped>
/* Allows textarea's rows attribute to work */
/deep/ .form-group.field-textArea .form-control {
  height: unset;

  // Unsets non scoped css by https://w33.bcn.cat/geobcn/js/0.5/jsapi.css
  border-color: rgb(212, 212, 212);
  background-color: #fff;
  outline: initial;
  box-shadow: initial;
  -webkit-box-shadow: initial;
  -moz-box-shadow: initial;
  -ms-box-shadow: initial;
}

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
</style>
