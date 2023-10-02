import RecordState from './RecordState.js'

describe('RecordState', () => {
  const transitionStates = Object.values(RecordState).filter(
    state => state.transition
  )
  describe('States', () => {
    it('should include all implemented states', () => {
      const implemented = [
        'PENDING_VALIDATE',
        'PENDING_PLAN',
        'PENDING_RESOLUTION',
        'PENDING_ANSWER',
      ]
      expect(Object.keys(RecordState)).toEqual(
        expect.arrayContaining(implemented)
      )
    })
  })
  describe('isClosed', () => {
    it('should return true if close state', () => {
      expect(RecordState.isClosed(RecordState.CLOSED.id)).toBe(true)
      expect(RecordState.isClosed(RecordState.CANCELED.id)).toBe(true)
      expect(RecordState.isClosed(RecordState.EXTERNAL_PROCESSING.id)).toBe(
        true
      )
    })
    it('should return false otherwise', () => {
      expect(RecordState.isClosed(RecordState.PENDING_ANSWER.id)).toBe(false)
      expect(RecordState.isClosed(RecordState.PENDING_VALIDATE.id)).toBe(false)
      expect(RecordState.isClosed(RecordState.PENDING_PLAN.id)).toBe(false)
      expect(RecordState.isClosed(RecordState.PENDING_RESOLUTION.id)).toBe(
        false
      )
    })
  })
  describe('findByTransition', () => {
    it('should find state by transition', () => {
      for (let state of transitionStates) {
        const result = RecordState.findByTransition(state.transition)
        expect(result).toBe(state)
      }
    })
    it('should return null when transition is invalid', () => {
      expect(RecordState.findByTransition('null')).toBeNull()
    })
  })
  describe('expandIdealPath', () => {
    const idealPath = ['validate', 'planifying', 'resolute']
    it('should expand state', () => {
      const path = idealPath.slice(0, 0)
      const result = RecordState.expandIdealPath(path, idealPath[0])
      expect(result.length).toBe(path.length)
      for (let step of result) {
        expect(step.transition).toBe(path[0])
      }
    })
    it('should mark active', () => {
      const current = idealPath[1]
      const result = RecordState.expandIdealPath(idealPath, current)
      expect(result[1].active).toBe(true)
    })
    it('should mark ready', () => {
      const current = idealPath[1]
      const result = RecordState.expandIdealPath(idealPath, current)
      expect(result[0].ready).toBe(true)
    })
    it('should pending_validate', () => {
      const current = idealPath[1]
      const result = RecordState.expandIdealPath(
        ['pending_validate', 'validate'],
        current
      )
      expect(result.length).toBe(1)
      expect(result[0].transition).toBe('validate')
    })
  })
})
