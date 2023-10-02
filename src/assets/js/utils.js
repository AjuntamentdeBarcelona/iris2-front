/**
 * Set difference
 * @param {Array} arrayA Main array
 * @param {Array} arrayB Array whose elements we want to substract from the previous
 * @param {function(*, Array): boolean} filterFn Function that takes a value of arrayA and the entire arrayB and returns a boolean
 * @returns {Array}  Array containing the elements present in arrayA but not in arrayB, or as defined by the filterFn
 */
export function setDifference(arrayA, arrayB, filterFn) {
  return arrayA.filter(
    valueA => (filterFn ? filterFn(valueA, arrayB) : !arrayB.includes(valueA))
  )
}

export function arrayToObject(array, keyField) {
  return array.reduce((obj, item) => {
    obj[item[keyField]] = item
    return obj
  }, {})
}

/**
 * Transforms objects into their array representation
 * @param {Object} object The object to convert
 * @returns {Array} An array of objects containing each key: value in the original object
 * @example
 *
 * const object = {'a': {'aa': 1}, 'b': { 'bb': 2}}
 * objectToArray(object)
 * // => [{'a': {'aa': 1}}, {'b': {'bb': 2}}}]
 */
export function objectToArray(object) {
  return Object.keys(object).map(key => ({ [key]: object[key] }))
}

/**
 * Async FileReader
 * @param {Blob|File} file The file to read
 * @param {string} readAs FileReader method (readAsArrayBuffer, readAsBinaryString, readAsDataURL, readAsText)
 * @returns {*} Method's return
 */
export function asyncFileReader(file, readAs) {
  const fileReader = new FileReader()

  return new Promise((resolve, reject) => {
    fileReader.onerror = () => {
      fileReader.abort()
      reject(new DOMException("Can't parse file"))
    }

    fileReader.onload = () => {
      resolve(fileReader.result)
    }

    fileReader[readAs](file)
  })
}

/**
 * DataURL to Blob
 * @param {string} dataURL File's data as a base64 encoded string
 * @returns {Promise<Blob>} DataURL on a raw data object
 */
export async function dataURLtoBlob(dataURL) {
  const blob = await fetch(dataURL).then(res => res.blob())
  return blob
}

/**
 * Extracts the filename of a content-disposition header
 * @param {string} contentDisposition content-disposition header contents
 * @returns {string} filename
 * @todo Handle filename* parameter
 * @example
 *
 * const contentDisposition = 'attachment; filename=quequicom.xlsx'
 * getContentDispositionFilename(contentDisposition)
 * // => 'quequicom.xlsx'
 */
export function getContentDispositionFilename(contentDisposition) {
  const contentSeparator = /\s*;\s*/
  const valueSeparator = /\s*=\s*/

  const filename = contentDisposition
    .split(contentSeparator)
    .find(s => s.includes('filename'))
    .split(valueSeparator)[1]

  return filename
}

/**
 * Checks whether a date range is possible or not
 * @param {string} date1
 * @param {string} date2
 * @returns {boolean}
 */
export function validDateRange(date1, date2) {
  return new Date(date1) <= new Date(date2)
}

/**
 * Checks the amount of time between two dates in days
 * @param {string} date1
 * @param {string} date2
 * @returns {number} Timespan in days
 * @example
 *
 * const date1 = "2019-11-29"
 * const date2 = "2019-11-28"
 * timeSpanDays(date1, date2)
 * // => 1
 */
export function timeSpanDays(date1, date2) {
  return (
    (new Date(date2).getTime() - new Date(date1).getTime()) / (1000 * 3600 * 24)
  )
}

// node_modules/vue-form-generator/src/utils/validators.js
export const vfgEmailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ // eslint-disable-line no-useless-escape

export function isEmail(string) {
  return vfgEmailRegex.test(string)
}

export function pasCamelToKebab(string) {
  return string
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map(x => x.toLowerCase())
    .join('-')
}
