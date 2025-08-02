import { Interceptor } from "./interceptor.mjs";

/**
 * logs args and result
 */
export class LoggingInterceptor extends Interceptor {
  /**
   * @return {string} 'logging'
   */
  static get name() {
    return "logging";
  }

  async receive(endpoint, next, ...args) {
    const logger = endpoint.owner;
    logger.info(`${endpoint.identifier}: > ${JSON.stringify([...args])}`);

    try {
      const result = await next(...args);
      logger.info(`${endpoint.identifier}: < ${result === undefined ? '' : result}`);
      return result;
    } catch (e) {
      logger.error(`${endpoint.identifier}: ${e}`);
      throw e;
    }
  }
}
