/***
 * Use this plugin in replacement of axios.js for working with Barcelona's townhall OAM.
 */
export default async function({ $axios, app }) {
  const SESSION_URL = '/session/info'
  const HTTP_METHODS = ['post', 'get', 'put', 'patch', 'delete']
  try {
    const session_info = await (await fetch(SESSION_URL, {
      credentials: 'same-origin',
    })).json()
    setInterval(() => {
      fetch(SESSION_URL, {
        credentials: 'same-origin',
      })
    }, 1000 * 60 * 10)

    $axios.setHeader(
      'X-IBM-Client-Id',
      app.$irisConfig.CLIENT_ID_HEADER,
      HTTP_METHODS
    )

    if (app.$irisConfig.DEVELOP) {
      // Simulate OAM in development by sending a mocked session that backend will accept
      $axios.setHeader(
        'x-imi-authorization',
        JSON.stringify(session_info),
        HTTP_METHODS
      )
    }
  } catch (e) {
    console.error(e)
    // window.location.reload(true)
  }
}
