import {
  addType,
  duration_ms_attribute_writable,
  count_attribute_writable,
  default_collection_attribute_writable
} from "pacc";
import { Interceptor } from "./interceptor.mjs";

/**
 * Limits the number of concurrent requests.
 * Requests can be delayed or rejected.
 * Sample config:
 * [
 *  { count: 20 },
 *  { count: 10, delay:  100 },
 *  { count:  5, delay:   10 }
 * ]
 *  1 -  4 : no delay
 *  5 -  9 : 10ms delay
 * 10 - 19 : 100ms delay
 * 20      : reject
 * default is to reject when more than 10 requests are on the way
 */
export class LimitingInterceptor extends Interceptor {
  /**
   * @return {string} 'request-limit'
   */
  static get name() {
    return "request-limit";
  }

  static attributes = {
    limits: {
      ...default_collection_attribute_writable,
      constructor: Array,
      name: "limits",
      default: [
        {
          count: 10
        }
      ],
      attributes: {
        count: count_attribute_writable,
        delay: { ...duration_ms_attribute_writable, name: "delay" }
      }
    }
  };

  static {
    addType(this);
  }

  /**
   *
   * @param {Object?} config
   */
  /*constructor(config) {
    super(config);
    this.limits = config?.limits || this.attributes.limits.default;
  }*/

  toJSONWithOptions(options) {
    const json = super.toJSONWithOptions(options);

    console.log("LIMITS",this.limits);

    json.limits = this.limits;
    return json;
  }

  reset() {
    this.ongoingResponses = new Set();
    this.ongoingRequests = 0;
  }

  async receive(endpoint, next, ...args) {
    for (const limit of this.limits) {
      if (this.ongoingRequests >= limit.count) {
        if (limit.delay === undefined) {
          throw new Error(`Limit of ongoing requests ${limit.count} reached`, {
            cause: this.ongoingRequests
          });
        }

        this.ongoingRequests += 1;

        return new Promise((resolve, reject) =>
          setTimeout(
            () => resolve(this._processRequest(next, ...args)),
            limit.delay
          )
        );
      }
    }

    this.ongoingRequests += 1;

    return this._processRequest(next, ...args);
  }

  _processRequest(next, ...args) {
    const currentResponse = next(...args).finally(() => {
      this.ongoingResponses.delete(currentResponse);
      this.ongoingRequests -= 1;
    });

    this.ongoingResponses.add(currentResponse);

    return currentResponse;
  }
}
