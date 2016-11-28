/* jslint node: true, esnext: true */
'use strict';

import {
	ConnectorMixin, rejectingReceiver
}
from './ConnectorMixin';

import Interceptor from './Interceptor';
import TimeoutInterceptor from './TimeoutInterceptor';
import StatsCollectorInterceptor from './StatsCollectorInterceptor';
import LimitingInterceptor from './LimitingInterceptor';

function registerWithManager(manager) {
	return Promise.all([
		manager.registerInterceptor(TimeoutInterceptor),
		manager.registerInterceptor(exports.LimitingInterceptor),
		manager.registerInterceptor(exports.StatsCollectorInterceptor)
	]);
}

export {
	registerWithManager,
	ConnectorMixin, rejectingReceiver,
	Interceptor,
	TimeoutInterceptor,
	StatsCollectorInterceptor,
	LimitingInterceptor
};
