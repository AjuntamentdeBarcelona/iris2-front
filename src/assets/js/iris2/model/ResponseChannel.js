export default {
  EMAIL: 0,
  SMS: 1,
  LETTER: 2,
  NONE: 3,
  TELEPHONE: 5,
  IMMEDIATE: 4,
  getAll(vm) {
    return [
      { id: this.EMAIL, description: vm.$t('email') },
      { id: this.SMS, description: vm.$t('sms') },
      { id: this.TELEPHONE, description: vm.$t('telephone') },
      { id: this.LETTER, description: vm.$t('letter') },
      { id: this.NONE, description: vm.$t('none') },
    ]
  },
  getGeoBcnMunicipality() {
    return 'Barcelona'
  },
  getGeoBcnProvince() {
    return 'Barcelona'
  },
  getBCNCityPostal() {
    return '080'
  },
  /**
   * @return {Boolean} True if the given response channel id does not require a written answer.
   */
  noEditedAnswer(channelID) {
    return [this.TELEPHONE, this.NONE].indexOf(channelID) >= 0
  },
  /**
   * @return {Boolean} True if the given response channel can have an answer without big text limitations.
   */
  isLongAnswer(channelID) {
    return [this.EMAIL, this.LETTER, this.IMMEDIATE].indexOf(channelID) >= 0
  },
}
