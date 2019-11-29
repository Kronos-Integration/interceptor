import { mergeAttributes, createAttributes } from "model-attributes";
import { Interceptor } from "./interceptor.mjs";

/**
 * Rejects a request if it does not resolve in a given time
 */
export class TimeoutInterceptor extends Interceptor {
  static get configurationAttributes() {
    return mergeAttributes(
      createAttributes({
        timeout: {
          description: "request timeout",
          default: 1,
          type: "duration"
        }
      }),
      Interceptor.configurationAttributes
    );
  }

  /**
   * @return {string} 'timeout'
   */
  static get name() {
    return "timeout";
  }

  receive(...args) {
    return rejectUnlessResolvedWithin(
      this.connected.receive(...args),
      this.timeout * 1000,
      this
    );
  }
}

/**
 * Rejects promise when it ia not resolved within given timeout
 * @param {Promise} promise
 * @param {number} timeout in miliseconds
 * @param {string} name
 * @return {Promise}
 */
function rejectUnlessResolvedWithin(promise, timeout, name) {
  if (timeout === 0) return promise;

  return new Promise((resolve, reject) => {
    const th = setTimeout(
      () =>
        reject(new Error(`${name} request not resolved within ${timeout}ms`)),
      timeout
    );
    
    promise.then(resolve, reject).finally(() => clearTimeout(th));
  });
}
