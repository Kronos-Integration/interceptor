import { addType, duration_ms_attribute } from "pacc";
import { Interceptor } from "@kronos-integration/interceptor";

/**
 *
 */
export class MonitoringInterceptor extends Interceptor {
  static attributes = {
    gracePeriod: {
      ...duration_ms_attribute,
      writable: true,
      name: "gracePeriod",
      default: "120s"
    },
    settingPeriod: {
      ...duration_ms_attribute,
      writable: true,
      name: "settingPeriod",
      default: "300s"
    }
  };

  /**
   * @return {string} 'monitor'
   */
  static get name() {
    return "monitor";
  }

  static {
    addType(this);
  }

  reset() {
    this.endpointStates = new Map();
  }

  /*
  gracePeriod = 2 * 60 * 1000;
  settingPeriod = 5 * 60 * 1000;
*/

  async receive(endpoint, next, ...args) {
    const state = this.endpointStates.get(endpoint);

    if (this.check(endpoint, ...args)) {
      if (state) {
        endpoint.warn(`${endpoint.name}: back ok`);
        this.endpointStates.delete(endpoint);
      }
    } else {
      const now = Date.now();

      if (state === undefined) {
        this.endpointStates.set(endpoint, { time: now, state: 0 });
        endpoint.info(`${endpoint.name}: entering monitoring period`);
      } else {
        switch (state.state) {
          case 0:
            if (now - state.time > this.gracePeriod) {
              state.time = now;
              state.state += 1;
              endpoint.warn(
                `${endpoint.name}: execute monitoring resolveAction`
              );
              await this.resolveAction(endpoint);
            }
            break;

          case 1:
            if (now - state.time > this.settingPeriod) {
              endpoint.info(`${endpoint.name}: clear monitoring action`);
              this.endpointStates.delete(endpoint);
            }
            break;
        }
      }
    }

    return super.receive(endpoint, next, ...args);
  }
}
