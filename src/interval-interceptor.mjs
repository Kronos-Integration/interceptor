import { addType, duration_ms_attribute_writable } from "pacc";
import { Interceptor } from "./interceptor.mjs";

/**
 * Only passes requests after inteval time has passed
 * @property {number} interval
 */
export class IntervalInterceptor extends Interceptor {
  static attributes = {
    interval: {
      ...duration_ms_attribute_writable,
      name: "interval",
      description: "min interval between two requests",
      default: "60s"
    }
  };

  /**
   * @return {string} 'interval'
   */
  static get name() {
    return "interval";
  }

  static {
    addType(this);
  }

  async receive(endpoint, next, ...args) {
    const now = new Date();

    if (!this.lastTime || now - this.lastTime > this.interval) {
      this.lastTime = now;
      return super.receive(endpoint, next, ...args);
    }
  }
}
