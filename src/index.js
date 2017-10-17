import { ConnectorMixin, rejectingReceiver } from './connector-mixin';

import Interceptor from './interceptor';
import TimeoutInterceptor from './timeout-interceptor';
import StatsCollectorInterceptor from './stats-collector-interceptor';
import LimitingInterceptor from './limiting-interceptor';

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
