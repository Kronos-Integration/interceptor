/* jslint node: true, esnext: true */

"use strict";

const Interceptor = require('./interceptor').Interceptor;

/**
 * Rejects a request if it does not resolve in a given time
 */
class TimeoutInterceptor extends Interceptor {
	static get type() {
		return "timeout";
	}

	get type() {
		return "timeout";
	}

	constructor(endpoint, config) {
		super(endpoint, config);

		Object.defineProperty(this, 'timeout', {
			value: config ? config.timeout : 1000
		});
	}

	receive(request) {
		return rejectUnlessResolvedWithin(this.connected.receive(request), this.timeout, this);
	}
}

/**
 *
 */
function rejectUnlessResolvedWithin(promise, timeout, name) {
	if (timeout === 0) return promise;

	return new Promise(function (fullfill, reject) {
		const th = setTimeout(() => {
			reject(new Error(`${name} request not resolved within ${timeout}ms`));
		}, timeout);

		return promise.then(fullfilled => {
			clearTimeout(th);
			fullfill(fullfilled);
		}, rejected => {
			clearTimeout(th);
			reject(rejected);
		});
	});
}


module.exports = TimeoutInterceptor;
