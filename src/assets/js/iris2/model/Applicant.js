import { isValidNif } from '~/assets/js/helpers.js'

export default {
  NO_INTRODUCE_SEX: 'u',
  MALE: 'm',
  FEMALE: 'f',
  GENERIC_MARC: 'ND',
  NIF: 0,
  NIE: 1,
  PASS: 2,

  isGeneric(applicant) {
    const data = applicant.citizen ? applicant.citizen : applicant.social_entity
    return data.dni == this.GENERIC_MARC
  },
  getDocMap() {
    return {
      null: this.PASS,
      '': this.PASS,
      nif: this.NIF,
      nif_k: this.NIF,
      nif_l: this.NIF,
      nif_m: this.NIE,
      nif_x: this.NIE,
      nif_y: this.NIE,
      nif_z: this.NIE,
    }
  },
  getCitizenDocumentType(doc) {
    const docType = isValidNif(doc)
    const docMap = this.getDocMap()
    return docMap[docType]
  },
}
