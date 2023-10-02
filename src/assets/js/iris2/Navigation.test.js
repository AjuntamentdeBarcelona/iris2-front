import iris2Routes from './Navigation'
describe('IRIS Navigation Values', () => {
  it('should be list of navigation items', () => {
    expect(iris2Routes).toBeInstanceOf(Array)
    iris2Routes.forEach(route => {
      expect(route).toBeInstanceOf(Object)
      expect(route.title).toBeTruthy()
      expect(route.routerLinkOps).toBeTruthy()
    })
  })
})
