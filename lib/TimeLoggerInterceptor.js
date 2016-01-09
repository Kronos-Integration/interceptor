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

  /**
   * Logs the time the requests takes
   */
  receive(request, oldRequest) {
    const logger = this.logger;
    const start = new Date();
    const response = this.connected.receive(request, oldRequest);
    return response.then(f => {
      const now = new Date();
      logger.debug(`took ${now - start} ms for ${request}`);
      return f;
    });
  }
}

module.exports = TimeLoggerInterceptor;
