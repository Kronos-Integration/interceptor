/* jslint node: true, esnext: true */

"use strict";

const Interceptor = require('./interceptor').Interceptor;

class TimeLoggerInterceptor extends Interceptor {
  static get type() {
    return "logger-request-time";
  }

  get type() {
    return TimeLoggerInterceptor.type;
  }

  reset() {
    this._numberOfRequests = 0;
    this._numberOfFailedRequests = 0;
    this._maxRequestProcessingTime = 0;
    this._totalRequestProcessingTime = 0;
  }

  get numberOfRequests() {
    return this._numberOfRequests;
  }

  get numberOfFailedRequests() {
    return this._numberOfFailedRequests;
  }

  get maxRequestProcessingTime() {
    return this._maxRequestProcessingTime;
  }

  get totalRequestProcessingTime() {
    return this._totalRequestProcessingTime;
  }

  /**
   * Logs the time the requests takes
   */
  receive(request, oldRequest) {

    this._numberOfRequests += 1;

    const start = new Date();
    const response = this.connected.receive(request, oldRequest);
    return response.then(f => {
      const now = new Date();
      const pt = now - start;
      this._totalRequestProcessingTime += pt;

      if (pt > this._maxRequestProcessingTime) {
        this._maxRequestProcessingTime = pt;
      }
      this.logger.debug(`took ${pt} ms for ${request}`);
      return f;
    }, r => {
      this._numberOfFailedRequests += 1;
      return r;
    });
  }
}

module.exports = TimeLoggerInterceptor;
