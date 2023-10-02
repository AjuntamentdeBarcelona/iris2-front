import PersonType from './PersonType.js'
describe('ApplicantType', () => {
  it('should be list of applicant types', () => {
    const expectedTypes = ['citizen', 'social_entity']
    const types = Object.values(PersonType).map(a_type => a_type.type)
    expect(types).toEqual(expectedTypes)
  })
})
