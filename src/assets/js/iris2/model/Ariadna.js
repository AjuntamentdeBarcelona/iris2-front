export default {
  ARIADNA_SAMPLE: '2019/102033',
  /**
   * The ariadna codes have a concrete format, this function validate them.
   * @param {*} code
   */
  validateCode(code) {
    return code.match(/^([0-9]){4}\/([0-9]){6}$/)
  },
}
