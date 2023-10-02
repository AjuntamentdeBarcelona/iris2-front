import Applicant from '~/assets/js/iris2/model/Applicant.js'

/**
 * Library for handling the CRM integration.
 *
 * The CRM integration is bassed in three steps, passing URL parameters:
 * - Add record with applicant data passed by params
 * - Find a record with its normalized id (record detail page)
 * - See the record list associated to an applicant.
 *
 * All the CRM calls include an org=CRM parameter.
 */
export default {
  ORG: 'CRM',
  CIT: 'PF',
  AGG: 'PJ',
  CAT: '0',
  CAST: '1',
  DEFAULT_DISTRICT: 11,
  SEX: {
    '1': Applicant.FEMALE,
    '0': Applicant.MALE,
  },
  DOC_TYPE: {
    '1': Applicant.NIF,
    '2': Applicant.NIE,
    '3': Applicant.PASS,
  },
  CITIZEN_ATTR_MAP: {
    docId: 'dni',
    nom: 'name',
    primerCognom: 'first_surname',
    segonCognom: 'second_surname',
    districte: 'district',
    anyNaixement: 'birth_year',
    sexe: 'sex',
    idioma: 'language',
    document_type: 'doc_type',
  },
  AGGRUPATION_ATTR_MAP: {
    docId: 'cif',
    raoSocial: 'social_reason',
    personaContacte: 'contact',
    districte: 'district',
    idioma: 'language',
  },
  /**
   * @return {Object|null} Applicant id passed by url, null in other case.
   */
  getDocumentFilters(params) {
    if (params.tipusPers) {
      const attr =
        params.tipusPers == this.CIT
          ? 'applicant_identifier'
          : 'applicant_identifier'
      return {
        [attr]: params.docId,
        [`${attr}_lookup`]: 'ilike_contains',
      }
    }
    return {}
  },
  /**
   * @param {*} params
   * @return {Boolean} True if there are CRM params for record creation.
   */
  isCRMCreation(params) {
    try {
      return params.tipusPers && params.org == this.ORG && params.docId
    } catch (e) {
      return false
    }
  },
  /**
   * @param {*} params
   * @return {Boolean} True if there are CRM params for record filtering list.
   */
  isCRMList(params) {
    try {
      return params.tipusPers && params.org == this.ORG && params.docId
    } catch (e) {
      return false
    }
  },
  /**
   * @param {*} params URL params from CRM
   * @return {Object} Valid IRIS2 applicant object created with the params.
   */
  getApplicatData(params) {
    params.idioma = this.convertLanguage(params.idioma)
    if (params.tipusPers == this.CIT) {
      return { citizen: this.getCitizenInitialData(params) }
    }
    return { social_entity: this.getAggrupationInitialData(params) }
  },
  /**
   * Converts applicant data using the CITIZEN_ATTR_MAP dict
   * @return {Object} Applicant data converted to a valid IRIS2 Citizen object.
   */
  getCitizenInitialData(params) {
    params.sexe = this.convertSex(params.sexe)
    let mapped = this._getMappedData(params, this.CITIZEN_ATTR_MAP)
    mapped.document_type =
      mapped.doc_type.trim() != ''
        ? this.convertDocType(mapped.doc_type)
        : Applicant.getCitizenDocumentType(mapped.doc_type)
    return mapped
  },
  /**
   * Converts applicant data using the CITIZEN_ATTR_MAP dict
   * @return {Object} Applicant data converted to a valid IRIS2 Citizen object.
   */
  getAggrupationInitialData(params) {
    return this._getMappedData(params, this.AGGRUPATION_ATTR_MAP)
  },
  _getMappedData(params, mappedAttrs) {
    let data = {}
    for (let [crmAttr, irisAttr] of Object.entries(mappedAttrs)) {
      data[irisAttr] = params[crmAttr]
    }
    return data
  },
  /**
   * @param {Number} numberLang CRM language expressed as number.
   * @return {String} Lang in ISO format.
   */
  convertLanguage(numberLang) {
    return `${numberLang}`.trim() == this.CAST ? 'es' : 'ca'
  },
  /**
   * @param {Number} numberSex CRM sex expressed as number.
   * @return {String} Sex expressed in IRIS2 format.
   */
  convertSex(numberSex) {
    return this.SEX[`${numberSex}`.trim()] || Applicant.NO_INTRODUCE_SEX
  },
  /**
   * @param {Number} numberSex CRM sex expressed as number.
   * @return {String} Sex expressed in IRIS2 format.
   */
  convertDocType(docType) {
    return this.DOC_TYPE[`${docType}`.trim()]
  },
}
