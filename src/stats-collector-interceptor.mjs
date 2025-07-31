import { Interceptor } from './interceptor.mjs';

/**
 * Interceptor to collect processing time, number of
 * processed and failed requests.
 */
export class StatsCollectorInterceptor extends Interceptor {
  /**
   * @return {string} 'collect-request-stats'
   */
  static get name() {
    return 'collect-request-stats';
  }

  #numberOfRequests;
  #numberOfFailedRequests;;
  #minRequestProcessingTime;;
  #maxRequestProcessingTime;
  #totalRequestProcessingTime;

  reset() {
    this.#numberOfRequests = 0;
    this.#numberOfFailedRequests = 0;
    this.#minRequestProcessingTime = Number.MAX_VALUE;
    this.#maxRequestProcessingTime = 0;
    this.#totalRequestProcessingTime = 0;
  }

  get numberOfRequests() {
    return this.#numberOfRequests;
  }

  get numberOfFailedRequests() {
    return this.#numberOfFailedRequests;
  }

  get maxRequestProcessingTime() {
    return this.#maxRequestProcessingTime;
  }

  get minRequestProcessingTime() {
    return this.#minRequestProcessingTime;
  }

  get totalRequestProcessingTime() {
    return this.#totalRequestProcessingTime;
  }

  /**
   * Logs the time the requests takes
   */
  async receive(endpoint,...args) {
    this.#numberOfRequests += 1;

    const start = Date.now();

    try {
      const response = await this.connected.receive(...args);
      const now = Date.now();
      const pt = now - start;
      this.#totalRequestProcessingTime += pt;

      if (pt > this.#maxRequestProcessingTime) {
        this.#maxRequestProcessingTime = pt;
      }

      if (pt < this.#minRequestProcessingTime) {
        this.#minRequestProcessingTime = pt;
      }

      endpoint.logger.debug(level=>`took ${pt} ms for ${[...args]}`);
      return response;
    } catch (err) {
      this.#numberOfFailedRequests += 1;
      throw err;
    }
  }
}
