import { prepareAttributesDefinitions, duration_ms_attribute } from "pacc";
import { Interceptor } from "./interceptor.mjs";

/**
 * Only passes requests after inteval time has passed
 * @property {number} interval
 */
export class IntervalInterceptor extends Interceptor {
  static attributes = prepareAttributesDefinitions(
    {
      interval: {
        ...duration_ms_attribute,
        description: "min interval between two requests",
        default: "60s",
      }
    },
    Interceptor.attributes
  );

  /**
   * @return {string} 'interval'
   */
  static get name() {
    return "interval";
  }

  async receive(endpoint, next, ...args) {
    const now = new Date();

    if (!this.lastTime || now - this.lastTime > this.interval) {
      this.lastTime = now;
      return super.receive(endpoint, next, ...args);
    }
  }
}
