/**
 * Given a number and a lenght, pads it with leading zeros to said length
 * @param {number} number Number to pad
 * @param {number} length Desired length
 * @returns {string} Formatted string
 */
export function pad(number, length) {
  var str = '' + number
  while (str.length < length) {
    str = '0' + str
  }

  return str
}

/**
 * Converts a date or date time to spanish local time (GMT+01:00)/(GMT+02:00) with the given format
 * @param {string} dateTime Date string to convert
 * @param {Object} options Object with conversion parameters as defined in:
 *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
 * @returns {string} Formatted string
 */
function dateTimeConverter(dateTime, options) {
  const date = new Date(dateTime)
  let localized_date = new Intl.DateTimeFormat('es-ES', options).format(date)

  // Fix for https://bugs.chromium.org/p/chromium/issues/detail?id=527926
  const regex = / (\d)(?=:)/
  const match = regex.exec(localized_date)

  if (match && match.length == 2) {
    localized_date = localized_date.replace(regex, ` ${pad(match[1], 2)}`)
  }

  return localized_date
}

/**
 * Given a date string, converts it to 'd/m/y'
 * Default year format is '2-digit'
 * "2019-02-11T01:00:00+01:00" -> "11/02/19" | "11/02/2019"
 * @param {string} date Date string to convert
 * @param {string} yearFormat Year format, 2-digit by default
 * @returns {string} Formatted string
 */
export function date(date, yearFormat) {
  const formats = {
    y: '2-digit',
    Y: 'numeric',
  }

  const options = {
    month: '2-digit',
    day: '2-digit',
    year: yearFormat ? formats[yearFormat] : formats.y,
    hour12: false,
  }

  return dateTimeConverter(date, options)
}

/**
 * Given a date string, converts it to 'd/m/y H/i/s'
 * "2019-02-11T01:00:00+01:00" -> "11/02/19 01:00:00"
 * @param {string} dateTime Date string to convert
 * @returns {string} Formatted string
 */
export function dateTime(dateTime) {
  const options = {
    month: '2-digit',
    day: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }

  return dateTimeConverter(dateTime, options)
}

/**
 * Given a date string, converts it to 'd/m/y H/i/s'
 * "2019-02-11T01:00:00+01:00" -> "11/02/19 01:00:00"
 * @param {string} dateTime Date string to convert
 * @returns {string} Formatted string
 */
export function dateHourMinute(dateTime) {
  const options = {
    month: '2-digit',
    day: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }

  return dateTimeConverter(dateTime, options)
}

/**
 * Returns '-' in the absence of a value, useful when displaying data
 * @param {*} value Value to check
 * @returns {*}
 */
export function def(value) {
  return value != null ? value : '-'
}

/**
 * Normalizes characters
 * @param {string} character Character to normalize
 * @returns {string} Normalized character
 */
export function normalizeCharacter(character) {
  return character
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

/**
 * Compares normalized characters
 * @param {string} charA Character to compare
 * @param {string} charB Character to compare
 * @returns {boolean} Comparison result
 */
export function equalCharacters(charA, charB) {
  return normalizeCharacter(charA) === normalizeCharacter(charB)
}

/**
 * Alphabetic sorting by description property
 */
export const compareFnByDescriptionAsc = (a, b) => {
  const aDesc = a.description.toLowerCase()
  const bDesc = b.description.toLowerCase()

  return compareFn(aDesc, bDesc)
}

export function compareFn(strA, strB, direction) {
  let result = strA.localeCompare(strB)
  return direction == 'desc' ? -result : result
}

/**
 * Compare function (alphabetic ascending)
 */
export function compareFnAsc(strA, strB) {
  return compareFn(strA, strB)
}

/**
 * Compare function (alphabetic descending)
 */
export function compareFnDesc(strA, strB) {
  return compareFn(strA, strB, 'desc')
}

/**
 * Alphabetic sorting
 * @param {Array<string>} data Data to sort
 * @param {string} direction Sort direction ('asc' | 'desc'), asc by default
 * @returns {Array<string>} Sorted data
 */
export function sortDataAlpabetically(data, direction) {
  return direction === 'desc'
    ? data.slice().sort(compareFnDesc)
    : data.slice().sort(compareFnAsc)
}

/**
 * Client side date sorting for small tables
 * @param {Array<Object>} data Data to sort
 * @param {string} column Property to sort by, must be a string representing a date
 * @param {string} direction Sort direction ('asc' | 'desc'), asc by default
 * @returns {Array<Object>} Sorted data
 */
export function sortDataByDate(data, column, direction) {
  function compare(a, b) {
    const dateA = new Date(a[column])
    const dateB = new Date(b[column])

    if (dateA < dateB) {
      return direction == 'asc' ? -1 : 1
    } else if (dateA > dateB) {
      return direction == 'asc' ? 1 : -1
    } else {
      return 0
    }
  }

  return data.slice().sort(compare)
}

/**
 * Client side pagination for small tables
 * @param {Array} array Data to paginate
 * @param {number} pageSize Amount of items per page
 * @param {number} page Page to retrieve
 * @returns {Array} Sliced data
 */
export function clientPagination(array, pageSize, page) {
  const from = (page - 1) * pageSize
  const to = from + pageSize

  return array.slice(from, to)
}

/**
 * Truncates strings to the provided length, with an optional ellipsis at the end
 * @param {string} text String to truncate
 * @param {number} length Length of the truncated string
 * @param {boolean} ellipsis Replaces the last 6 characters with an ellipsis to point out that it's been truncated
 * @returns {string} Truncated string
 */
export function truncate(text, length, ellipsis = false) {
  if (!text) {
    return ''
  }
  if (text.length <= length) {
    return text
  } else if (ellipsis) {
    return `${text.substr(0, length - 6)} (...)`
  } else {
    return text.substr(0, length)
  }
}

/**
 * Parses a string and determines whether it is a RecordCard's normalized_record_id or not
 * @param {string} text String to parse
 * @returns {boolean} Match of normalized_record_id known formats
 */
export function isNormalizedRecordId(text) {
  // I09345848L-01
  const regex1 = /^\D\d{8}\D-\d{2}$/
  // 4381BZC
  const regex2 = /^\d{4}\D{3}$/
  // 039AUIB
  const regex3 = /^\d{3}[A-Za-z]{4}$/
  // AAA1234
  const regex4 = /^\D{3}\d{4}$/
  // AAA1234-02 (RecordCard created from a claim)
  const regex5 = /^\D{3}\d{4}-\d{2,}$/
  // 4381BZC-02
  const regex6 = /^\d{4}\D{3}-\d{2,}$/
  // 039AUIB-02
  const regex7 = /^\d{3}[A-Za-z]{4}-\d{2,}$/

  const regexList = [regex1, regex2, regex3, regex4, regex5, regex6, regex7]

  const found = regexList.some(regex => {
    const match = regex.exec(text)
    if (match) {
      return true
    }
  })

  return found
}

/**
 * Checks if a value is an empty array
 * @param {*} value Value to check
 * @returns {boolean} Whether it's an empty array or not
 */
function isEmptyArray(value) {
  return Array.isArray(value) && !value.length
}

/**
 * Generates an object without properties that match the provided values
 * @param {Object} object Object to clean
 * @param {Array<*>} values Values to look for and ignore
 * @returns {Object} Cleaned clone of the object
 */
export function cleanObject(object, values) {
  let cleanedObject = {}
  const cleanEmptyArrays = values.some(value => isEmptyArray(value))
  const cleanEmptyObjects = values.some(value => isEmptyObject(value))

  Object.entries(object).forEach(entry => {
    const [property, value] = entry

    const keepValue = Array.isArray(value)
      ? !cleanEmptyArrays || (cleanEmptyArrays && !isEmptyArray(value))
      : isPlainObject(value)
        ? !cleanEmptyObjects || (cleanEmptyObjects && !isEmptyObject(value))
        : !values.includes(value)

    if (keepValue) {
      cleanedObject[property] = value
    }
  })

  return cleanedObject
}

/**
 * Determines if a variable is a plain object
 * @param {*} variable Variable to check
 * @returns {boolean} Whether it's a plain object or not
 */
export function isPlainObject(variable) {
  return (
    typeof variable == 'object' &&
    variable instanceof Object &&
    !(variable instanceof Array)
  )
}

export function isEmptyObject(variable) {
  return isPlainObject(variable) && !Object.keys(variable).length
}

/**
 * Checks the response class of a response status code
 * @param {number} responseStatus Response status code
 * @param {number} responseClass Response class (400, 500...)
 * @returns {boolean} Whether the response status pertains to the provided responseClass or not
 */
export function isResponseClass(responseStatus, responseClass) {
  return responseClass <= responseStatus && responseStatus < responseClass + 100
}

/**
 * Given an id returns the matching model or specified attribute
 * @param {(string|number)} modelId Id of the model
 * @param {Array<Object>} models List of models
 * @param {(string|number)} modelAttribute If given, instead of the whole object, just that attribute will be returned
 * @param {(string|number)} idAttribute Id attribute
 * @returns {(Object|string)} The object that goes by that id, or its specified attribute
 */
export function modelFromId(
  modelId,
  models,
  modelAttribute = undefined,
  idAttribute = 'id'
) {
  let model = undefined
  models.some((obj, ind, arr) => {
    if (obj[idAttribute] == modelId) {
      model = obj
      return true
    }
  })

  return modelAttribute ? (model ? model[modelAttribute] : undefined) : model
}

/**
 * Valid control characters for spanish NIFs
 */
const controlCharacters = 'TRWAGMYFPDXBNJZSQVHLCKE'

/**
 * Validates the control character of spanish NIFs. Assumes length of 9 characters
 * http://www.interior.gob.es/en/web/servicios-al-ciudadano/dni/calculo-del-digito-de-control-del-nif-nie
 * @param {string} nif Nif to check
 * @param {(number|string)} firstCharValue Numeric value of the first character, an empty string deletes it
 * @returns {boolean} Validation result
 */
export function isValidControlCharacter(nif, firstCharValue = undefined) {
  if (firstCharValue !== undefined) {
    nif = nif.replace(nif.substr(0, 1), firstCharValue)
  }

  const validControlCharacter =
    nif.substr(8, 1) === controlCharacters[Number(nif.substr(0, 8)) % 23]

  return validControlCharacter
}

/**
 * Validates spanish NIFs (for natural persons, not jurirical ones)
 * @param {string} nif NIF to validate
 * @returns {string} NIF type when it's valid, empty string if it's not
 */
export function isValidNif(nif) {
  const nifTypes = [
    {
      type: 'nif',
      pattern: String.raw`^\d{8}[${controlCharacters}]{1}$`,
      validator: {
        valFunction: isValidControlCharacter,
      },
    },
    {
      type: 'nif_k',
      pattern: String.raw`^K{1}\d{7}[${controlCharacters}]{1}$`,
    },
    {
      type: 'nif_l',
      pattern: String.raw`^L{1}\d{7}[${controlCharacters}]{1}$`,
    },
    {
      type: 'nif_m',
      pattern: String.raw`^M{1}\d{7}[${controlCharacters}]{1}$`,
    },
    {
      type: 'nif_x_v1',
      pattern: String.raw`^X{1}\d{8}[${controlCharacters}]{1}$`,
      validator: {
        valFunction: isValidControlCharacter,
        parameter: '',
      },
    },
    {
      type: 'nif_x_v2',
      pattern: String.raw`^X{1}\d{7}[${controlCharacters}]{1}$`,
      validator: {
        valFunction: isValidControlCharacter,
        parameter: 0,
      },
    },
    {
      type: 'nif_y',
      pattern: String.raw`^Y{1}\d{7}[${controlCharacters}]{1}$`,
      validator: {
        valFunction: isValidControlCharacter,
        parameter: 1,
      },
    },
    {
      type: 'nif_z',
      pattern: String.raw`^Z{1}\d{7}[${controlCharacters}]{1}$`,
      validator: {
        valFunction: isValidControlCharacter,
        parameter: 2,
      },
    },
  ]

  let detectedNifType = ''

  nifTypes.some(nifType => {
    const pattern = new RegExp(nifType.pattern)

    const validPattern = pattern.test(nif)
    const validControlCharacter = nifType.validator
      ? nifType.validator.valFunction(nif, nifType.validator.parameter)
      : true

    if (validPattern && validControlCharacter) {
      detectedNifType = nifType.type
      return true
    }
  })

  return detectedNifType
}

/**
 * Filters an object with a filter function
 * @param {Object} object The object to filter
 * @param {function(Object): boolean} filterFunction Function that takes an object with the current key: value pair
 *  that's being iterated and returns a boolean. {key: 'x', value: 'y'}
 * @returns {Object} The filtered object
 */
export function objectFilter(object, filterFunction) {
  let filteredObject = {}

  for (const key in object) {
    if (filterFunction({ key: key, value: object[key] })) {
      filteredObject[key] = object[key]
    }
  }

  return filteredObject
}

/**
 * Removes all new lines on an html text, such as the one produced by vue2-editor
 * @param {String} text The text to trim
 * @returns {String} Trimmed text
 */
export function trimHtmlText(text) {
  const trimmedText = text.replace(new RegExp('<p><br></p>', 'g'), '')
  return trimmedText
}
