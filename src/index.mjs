import { ConnectorMixin, rejectingReceiver } from "./connector-mixin.mjs";
import { Interceptor } from "./interceptor.mjs";
import { TimeoutInterceptor } from "./timeout-interceptor.mjs";
import { StatsCollectorInterceptor } from "./stats-collector-interceptor.mjs";
import { LimitingInterceptor } from "./limiting-interceptor.mjs";

export function registerWithManager(manager) {
  return Promise.all([
    manager.registerInterceptor(TimeoutInterceptor),
    manager.registerInterceptor(LimitingInterceptor),
    manager.registerInterceptor(StatsCollectorInterceptor)
  ]);
}

export {
  ConnectorMixin,
  rejectingReceiver,
  Interceptor,
  TimeoutInterceptor,
  StatsCollectorInterceptor,
  LimitingInterceptor
};
