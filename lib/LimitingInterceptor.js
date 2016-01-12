/* jslint node: true, esnext: true */

"use strict";

const Interceptor = require('./interceptor').Interceptor;

/**
 * limits the number of concurrent requests
 * [
 *  { requests: 5, delay: 10 },
 *  { requests: 10, delay: 100 },
 *  { requests: 20, delay: 1000 },
 *  { request: 50: reject: true }
 * ]
 * 1 - 4 - no delay
 * 5 - 9 - 10ms delay
 * 10 - 20 100ms delay
 */
class LimitingInterceptor extends Interceptor {
	static get type() {
		return "request-limit";
	}

	get type() {
		return LimitingInterceptor.type;
	}

	constructor(endpoint, config) {
		super(endpoint, config);

		Object.defineProperty(this, 'limit', {
			value: config ? config.limit : 10
		});

		this.ongoingResponses = new Set();
	}

	reset() {
		this.ongoingResponses = new Set();
	}

	receive(request, oldRequest) {
		if (this.ongoingResponses.size >= this.limit) {
			return Promise.reject(new Error(`Limit of ongoing requests ${this.limit} reached`));
		}

		let response = this.connected.receive(request, oldRequest);

		const currentResponse = response.then(resolved => {
			this.ongoingResponses.delete(currentResponse);
			return resolved;
		}).catch(rejected => {
			this.ongoingResponses.delete(currentResponse);
			return rejected;
		});

		this.ongoingResponses.add(currentResponse);

		return currentResponse;
	}
}

module.exports = LimitingInterceptor;
