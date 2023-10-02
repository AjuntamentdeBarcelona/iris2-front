import { pad } from '~/assets/js/helpers.js'

/**
 * Important vars that affect the claim behaviour, must be in sync with the backend.
 */
export default {
  CLAIM_EDITABLE_FIELDS: ['description'],
  CLAIM_TYPE_COMMENT: 'comment',
  /**
   * Given a record card returns the list of all the record card codes included in the
   * claim history. For example, given a record with id AAA0000-02 and claim number 3,
   * will return ['AAA0000', 'AAA0000-02', 'AAA0000-03']
   *
   * If the record is not claimed, will return only the original record code element.
   *
   * @param {*} recordCard
   */
  getClaimCodes(recordCard) {
    const recordId = recordCard.normalized_record_id.split('-')[0]
    let records = [recordId]
    for (var i = 2; i <= recordCard.claims_number; i++) {
      records.push(`${recordId}-${pad(i, 2)}`)
    }
    return records
  },
}
