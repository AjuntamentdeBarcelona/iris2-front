export function testProcessStep(process, mountFunction, action) {
  describe('Request url', () => {
    it('should be url prop if passed', () => {
      const testUrl = 'URL_VALUE'
      const comp = mountFunction(process, {
        url: testUrl,
      })
      expect(comp.vm.getRequestUrl()).toBe(testUrl)
    })
    it('should be action url prop if passed', () => {
      const testUrl = 'URL_VALUE'
      const comp = mountFunction(process, {
        url: testUrl,
      })
      expect(comp.vm.getRequestUrl()).toBe(testUrl)
    })
    it('should getProcessActionURL correctly', () => {
      const comp = mountFunction(process)
      expect(comp.vm.getProcessActionURL()).toBe(
        process.actions[action].action_url
      )
    })
  })
}
