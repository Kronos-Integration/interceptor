/* jslint node: true, esnext: true */
"use strict";

const ConnectorMixin = require('./lib/connector-mixin').connectorMixin;
const Interceptor = require('./lib/interceptor').Interceptor;

const RequestLimit = require('./lib/requestLimit').RequestLimit;
const RequestTimeLogger = require('./lib/requestTimeLogger').RequestTimeLogger;
const RequestTimeOut = require('./lib/requestTimeOut').RequestTimeOut;



exports.ConnectorMixin = ConnectorMixin;
exports.Interceptor = Interceptor;

exports.RequestLimit = RequestLimit;
exports.RequestTimeLogger = RequestTimeLogger;
exports.RequestTimeOut = RequestTimeOut;

exports.registerWithManager = function (manager) {
	manager.registerInterceptor(RequestLimit);
	manager.registerInterceptor(RequestTimeLogger);
	manager.registerInterceptor(RequestTimeOut);
};
