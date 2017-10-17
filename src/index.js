import { ConnectorMixin, rejectingReceiver } from './connector-mixin';

import Interceptor from './interceptor';
import TimeoutInterceptor from './timeout-interceptor';
import StatsCollectorInterceptor from './stats-collector-interceptor';
import LimitingInterceptor from './limiting-interceptor';

function registerWithManager(manager) {
  return Promise.all([
    manager.registerInterceptor(TimeoutInterceptor),
    manager.registerInterceptor(exports.LimitingInterceptor),
    manager.registerInterceptor(exports.StatsCollectorInterceptor)
  ]);
}

export {
  registerWithManager,
  ConnectorMixin,
  rejectingReceiver,
  Interceptor,
  TimeoutInterceptor,
  StatsCollectorInterceptor,
  LimitingInterceptor
};
