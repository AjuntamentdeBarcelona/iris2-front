<template>
  <div
    v-if="actionsPath.length > 0"
    class="record-card-process">
    <div v-if="process.workflow.records.length > 1">
      <button
        v-b-toggle.atributs
        class="col-12 cardi__main-title">
        <h3>{{ $t('unirecord_records') }}</h3>
        <div class="ml-auto">
          <small>
            {{ $t('show_more_content') }}
          </small>
          <i class="fas fa-caret-right card-toggle ml-1" />
        </div>
      </button>

      <b-collapse
        id="atributs"
        class="w-100 pt-1"
        visible
      >
        <unirecord-table
          :prop-data="process.workflow.records"
          class="process-unirecord"/>
      </b-collapse>

    </div>
    <ideal-path
      v-if="false"
      :path="idealPath"
      :current-step="process.current_step" />
    <b-tabs
      :value="indexOfCurrent">
      <b-tab
        v-for="step in actionsPath"
        :key="step.transition"
        :title="$t(step.title)"
        :disabled="!step.active && !step.ready"
      >
        <template slot="title">
          <font-awesome-icon
            v-if="step.ready || step.active"
            :icon="getTabIcon(step)" />
          {{ $t(step.title) }}
        </template>
        <div 
          v-if="!hasPermissionsForCurrent && step.active && !isClosed && !isLocked"
          class="alert alert-danger">
          {{ $t('authorization_error_description') }}
        </div>
        <component
          :is="step.component"
          :process="process"
          :detail="process.element_detail"
          :step="step"
          :read-only="!step.active || isClosed || isLocked || !hasPermissionsForCurrent"
          @form-saved="actionCompleted"
        />
      </b-tab>
    </b-tabs>
  </div>
</template>


<script>
import RecordState from '~/assets/js/iris2/model/RecordState.js'
import Plan from './process/Plan.vue'
import Resolution from './process/Resolution.vue'
import ProcessAnswers from './process/ProcessAnswers.vue'
import ExternalProcessing from './process/ExternalProcessing.vue'
import IdealPath from './IdealPath.vue'
import UnirecordTable from './UnirecordTable.vue'
import RequireThemeChangeVue from './process/RequireThemeChange.vue'

const transitionComponents = {
  [RecordState.PENDING_PLAN.transition]: Plan,
  [RecordState.PENDING_RESOLUTION.transition]: Resolution,
  [RecordState.PENDING_ANSWER.transition]: ProcessAnswers,
  [RecordState.EXTERNAL_PROCESSING.transition]: ExternalProcessing,
}
/**
 * This component manages the resolution of a given task (process).
 * It shows the ideal path and renders the component for completing the current state.
 * Implementing new actions (state transitions) is as simple as implementing its component
 * and attaching it to its transition in the transitionComponents. In other words, the
 * transitionComponents maps each transition with a component that implements the interaction.
 *
 * @todo By the moment, this component depends on working with a process with only one record.
 */
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
</style>
