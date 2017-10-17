import Interceptor from './interceptor';

import { mergeAttributes, createAttributes } from 'model-attributes';

/**
 * Rejects a request if it does not resolve in a given time
 */
export default class TimeoutInterceptor extends Interceptor {
  static get configurationAttributes() {
    return mergeAttributes(
      createAttributes({
        timeout: {
          description: 'request timeout',
          default: 1,
          type: 'duration'
        }
      }),
      Interceptor.configurationAttributes
    );
  }

  static get name() {
    return 'timeout';
  }

  receive(request) {
    return rejectUnlessResolvedWithin(
      this.connected.receive(request),
      this.timeout * 1000,
      this
    );
  }
}

/**
 *
 */
function rejectUnlessResolvedWithin(promise, timeout, name) {
  if (timeout === 0) return promise;

  return new Promise((fullfill, reject) => {
    const th = setTimeout(
      () =>
        reject(new Error(`${name} request not resolved within ${timeout}ms`)),
      timeout
    );

    return promise.then(
      fullfilled => {
        clearTimeout(th);
        fullfill(fullfilled);
      },
      rejected => {
        clearTimeout(th);
        reject(rejected);
      }
    );
  });
}
