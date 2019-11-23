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

  async receive(...args) {
    const logger = this.logger;
    logger.info(`${this.endpoint.identifier}: request ${JSON.stringify([...args])}`);

    try {
      const result = await this.connected.receive(...args);
      logger.info(`${this.endpoint.identifier}: result ${result}`);
      return result;
    } catch (e) {
      logger.error(`${this.endpoint.identifier}: result ${e}`);
      throw e;
    }
  }
}
