/**
 * This class can be used to raise errors from page components to the main
 * error handler of this SPA. When an exception is raised with this class,
 * the error Page will consider that all the information could be displayed
 * to the user, since the original error is handled and translated into a
 * user-friendly message.
 *
 * The error component identifies the user-friendly exceptions when the error
 * object has the userFriendly attribute and its value is true.
 *
 * @since Nuxt@v2.4.0
 */
class HandledPageError extends Error {
  constructor(message, title, description) {
    super(message)
    this.name = 'HandledPageError'
    this.userFriendly = true
    this.title = title
    this.description = description
  }
}

export default HandledPageError
