/* jslint node: true, esnext: true */

'use strict';

const Interceptor = require('./interceptor').Interceptor,
	mat = require('model-attributes');

/**
 * Rejects a request if it does not resolve in a given time
 */
class TimeoutInterceptor extends Interceptor {

	static get configurationAttributes() {
		return Object.assign(mat.createAttributes({
			timeout: {
				description: 'request timeout',
				default: 1,
				type: 'duration'
			}
		}), Interceptor.configurationAttributes);
	}

	static get name() {
		return 'timeout';
	}

	constructor(config, endpoint) {
		super(config, endpoint);

		Object.defineProperty(this, 'timeout', {
			value: config ? config.timeout : 1000
		});
	}

	toJSON() {
		const json = super.toJSON();
		json.timeout = this.timeout;
		return json;
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

	return new Promise((fullfill, reject) => {
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
