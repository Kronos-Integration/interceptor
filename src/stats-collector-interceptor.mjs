import { Interceptor } from "./interceptor.mjs";

/**
 * Interceptor to collect processing time, number of
 * processed and failed requests.
 */
export class StatsCollectorInterceptor extends Interceptor {
  /**
   * @return {string} 'collect-request-stats'
   */
  static get name() {
    return "collect-request-stats";
  }

  reset() {
    this.numberOfRequests = 0;
    this.numberOfFailedRequests = 0;
    this.minRequestProcessingTime = Number.MAX_VALUE;
    this.maxRequestProcessingTime = 0;
    this.totalRequestProcessingTime = 0;
  }

  /**
   * Logs the time the requests takes
   */
  async receive(endpoint, next, ...args) {
    this.numberOfRequests += 1;

    const start = Date.now();

    try {
      const response = await next(...args);
      const now = Date.now();
      const pt = now - start;
      this.totalRequestProcessingTime += pt;

      if (pt > this.maxRequestProcessingTime) {
        this.maxRequestProcessingTime = pt;
      }

      if (pt < this.minRequestProcessingTime) {
        this.minRequestProcessingTime = pt;
      }

      return response;
    } catch (err) {
      this.numberOfFailedRequests += 1;
      throw err;
    }
  }
}
