import proj4 from 'proj4'

/**
 * Convert coordinates from ESG89 to WGS84:
 * @param {array} ESG89_coordinates
 * @returns {object} WGS84_coordinates
 * @example
 * const ESG89_coordinates = [41.396103, 2.180714];
 * toSpainCoordinates(ESG89_coordinates)
 * // => [431519.31419357, 4583033.89719444}]
 * Where:
 * The coordinate xetrs89a is 431519.31419357 and the coordinate yetrs89a is 4583033.89719444
 */

export function coordinatesConversor([coordinate1, coordinate2], UTM_ZONE) {
  var projections = {
    WGS84: '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs',
    ETRS89: `+proj=utm +zone=${UTM_ZONE} +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs`,
  }
  var result = convert(coordinate1, coordinate2)
  function convert(x, y) {
    const finalCoordinates = proj4(
      projections['ETRS89'],
      projections['WGS84'],
      [x, y]
    )
    return finalCoordinates.reverse()
  }
  return result
}
