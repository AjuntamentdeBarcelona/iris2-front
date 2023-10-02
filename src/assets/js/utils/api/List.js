/**
 * API Rest Framework lists utilities with axios.
 */
export default {
  /**
   * Loads n the pages for a concrete model
   * @returns {Promise} Promise called when all the requests are done.
   */
  loadPages(axios, url, itemsPerPage, maxPages = 5, prevResult = []) {
    return axios.get(url).them(resp => {
      if (resp.results && maxPages) {
        return this.loadPages(axios, resp.next, itemsPerPage, maxPages - 1)
      }
    })
  },
}
