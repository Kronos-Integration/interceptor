import { prepareAttributesDefinitions, duration_ms_attribute } from "pacc";
import { Interceptor } from "./interceptor.mjs";

/**
 * Rejects a request if it does not resolve in a given time.
 * @property {number} timeout
 */
export class TimeoutInterceptor extends Interceptor {
  static attributes = prepareAttributesDefinitions(
    {
      timeout: {
        ...duration_ms_attribute,
        description: "request timeout",
        default: "10s",
      }
    },
    Interceptor.attributes
  );

  /**
   * @return {string} 'timeout'
   */
  static get name() {
    return "timeout";
  }

  receive(endpoint, next, ...args) {
    return rejectUnlessResolvedWithin(next(...args), this.timeout, this);
  }
}

/**
 * Rejects promise when it is not resolved within given timeout.
 * @param {Promise<any>} promise
 * @param {number} timeout in miliseconds
 * @param {Interceptor} source
 * @return {Promise<any>}
 */
function rejectUnlessResolvedWithin(promise, timeout, source) {
  if (timeout === 0) return promise;

  return new Promise((resolve, reject) => {
    const th = setTimeout(
      () =>
        reject(new Error(`${source} request not resolved within ${timeout}ms`)),
      timeout
    );

    promise.then(resolve, reject).finally(() => clearTimeout(th));
  });
}
