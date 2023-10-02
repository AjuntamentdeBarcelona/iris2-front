const RecordState = {
  PENDING_VALIDATE: {
    id: 0,
    title: 'record_card_validation',
    transition: 'validate',
  },
  PENDING_PLAN: {
    id: 1,
    title: 'record_card_planning',
    transition: 'planifying',
    task: 'Planning',
  },
  PENDING_RESOLUTION: {
    id: 2,
    title: 'record_card_solving',
    transition: 'resolute',
    task: 'Resolution',
  },
  PENDING_ANSWER: {
    id: 3,
    title: 'record_card_answer',
    transition: 'answer',
    'draft-transition': 'draft-answer',
  },
  EXTERNAL_PROCESSING: {
    id: 7,
    title: 'record_card_external_processing',
    transition: 'external_processing',
  },
  CLOSED: {
    id: 4,
    title: 'record_card_closed',
    transition: 'CLOSED',
  },
  CANCELED: {
    id: 5,
    title: 'record_card_canceled',
    transition: 'CANCELED',
  },
  NO_PROCESSED: {
    id: 6,
    title: 'record_card_no_processed',
    transition: 'NO_PROCESSING',
  },
  NOT_TRAMIT: {
    id: 9,
    title: 'record_card_no_processed',
    transition: 'NO_PROCESSING',
  },
  isExternal(stateId) {
    return stateId == this.EXTERNAL_PROCESSING.id
  },
  findById(id, def) {
    for (const p in this) {
      if (this.hasOwnProperty(p)) {
        if (this[p].id == parseInt(id)) {
          return this[p]
        }
      }
    }
    return def
  },
  isClosed(state) {
    return (
      [this.CLOSED.id, this.CANCELED.id, this.EXTERNAL_PROCESSING.id].indexOf(
        state
      ) >= 0
    )
  },
  /**
   * @param {String} transition
   * @returns {Object} the state related to the transition
   */
  findByTransition(transition) {
    for (let value of Object.values(this)) {
      if (value.transition && value.transition == transition) {
        return value
      }
    }
    return null
  },
  /**
   * Given a list of transitions, converts the ideal path in an array of objects with all the info
   * needed for displating a complete UI.
   * @param {Array} path ideal path as a list of transition string
   * @return {Array} array of objects with expanded transition info
   */
  expandIdealPath(path, current) {
    current = current == 'pending_answer' ? 'answer' : current
    const currentIndex = path.indexOf(current)
    return path
      .map(step => {
        return Object.assign({
          transition: step,
          active: step == current,
          ready:
            current !== 'closed' ? path.indexOf(step) < currentIndex : true,
          ...this.findByTransition(step),
        })
      })
      .filter(step => step.transition != 'pending_validate')
  },
}

export default RecordState
