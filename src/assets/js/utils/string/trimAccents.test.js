import trimAccents from './trimAccents.js'

describe('Trim accents', () => {
  it('should trim accents', () => {
    const accents = 'áàéèìíóòúù'
    const trimmed = 'aaeeiioouu'
    expect(trimAccents(accents)).toEqual(trimmed)
    expect(trimAccents(accents.toUpperCase())).toEqual(trimmed.toUpperCase())
  })
})
