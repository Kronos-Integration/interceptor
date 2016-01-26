/* jslint node: true, esnext: true */
"use strict";

exports.ConnectorMixin = require('./lib/connector-mixin').connectorMixin;
exports.Interceptor = require('./lib/interceptor').Interceptor;

exports.LimitingInterceptor = require('./lib/LimitingInterceptor');
exports.StatsCollectorInterceptor = require('./lib/StatsCollectorInterceptor');
exports.TimeoutInterceptor = require('./lib/TimeoutInterceptor');

exports.registerWithManager = function (manager) {
	manager.registerInterceptor(exports.LimitingInterceptor);
	manager.registerInterceptor(exports.StatsCollectorInterceptor);
	manager.registerInterceptor(exports.TimeoutInterceptor);
};
