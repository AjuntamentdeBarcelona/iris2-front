/**
 * Mixin for implementing the interface of a process step compatible with
 * the Process.vue component.
 */
export default {
  props: {
    /**
     * Process object with at least three properties:
     * - ideal_path
     * - actions
     * - current_step
     * - workflow.comments o comments
     */
    process: {
      type: Object,
      required: true,
    },
    /**
     * ElementDetail of the process
     */
    detail: {
      type: Object,
      required: true,
    },
    /**
     * Ideal path step
     */
    step: {
      type: Object,
      required: true,
    },
    /**
     * If true, the underliying form will be disabled and the save buttons will be removed.
     */
    readOnly: {
      type: Boolean,
      default: true,
    },
    url: {
      type: String,
      default: '',
      required: false,
    },
    commentTask: {
      type: String,
      default: '',
      required: true,
    },
  },
  methods: {
    /**
     * Each step in the workflow can have its own comments.
     * @return {Array} Comments for the current step
     */
    getStepComments() {
      return this.getProcessComments().filter(
        comment => comment.task.toLowerCase() == this.commentTask
      )
    },
    /**
     * Since this component can work with both RecordCards or Process, this method must decide
     *  from which attribute retrieve the comments.
     * @return {Array} Comments of the process
     */
    getProcessComments() {
      return this.process.workflow != null
        ? this.process.workflow.comments
        : this.process.comments || []
    },
    adaptSchema(definition) {
      for (let field of Object.values(definition.fields)) {
        field.disabled = this.readOnly
      }
    },
    /**
     * Gets the enpoint from the process or from url prop
     */
    getRequestUrl(obj) {
      return this.url
        ? this.url
        : _.trimStart(this.getProcessActionURL(), '/services/iris/')
    },
    /**
     * Gets the enpoint for saving from the step and the actions of the process
     */
    getProcessActionURL() {
      const action =
        this.step.transition == 'pending_answer'
          ? 'answer'
          : this.step.transition
      return this.process.actions[action].action_url
    },
    hasActionPermission() {
      return this.getProcessActionURL() != undefined
    },
  },
}
