import { TaskQueue } from 'cwait'
/**
 * Utility function with queueing. It acts as a facade of underliying libreries,
 * avoiding dependencies from concret implementations.
 */
export default {
  /**
   * Executes a list of
   *
   * @param {*} fn
   * @param {*} max
   */
  promises(values, max = 6, fn) {
    const queue = new TaskQueue(Promise, max)
    return Promise.all(values.map(queue.wrap(value => fn(value))))
  },
}
