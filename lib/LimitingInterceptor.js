/* jslint node: true, esnext: true */

"use strict";

const Interceptor = require('./interceptor').Interceptor;

/**
 * Limits the number of concurrent requests.
 * Requests can be delayed or rejected.
 * [
 *  { count: 20 },
 *  { count: 10, delay:  100 },
 *  { count:  5, delay:   10 }
 * ]
 *  1 -  4 : no delay
 *  5 -  9 : 10ms delay
 * 10 - 19 : 100ms delay
 * 20      : reject
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

		Object.defineProperty(this, 'limits', {
			value: config ? config.limits : [{
				count: 10
			}]
		});

		this.reset();
	}

	reset() {
		this.ongoingResponses = new Set();
		this.ongoingRequests = 0;
	}

	receive(request, oldRequest) {
		//console.log(`got #${this.ongoingRequests}`);

		for (let limit of this.limits) {
			if (this.ongoingRequests >= limit.count) {
				if (limit.delay === undefined) {
					//console.log(`-> reject`);
					return Promise.reject(new Error(`Limit of ongoing requests ${limit.count} reached`));
				}

				//console.log(`-> delay ${limit.delay}`);
				this.ongoingRequests += 1;

				return new Promise((fullfill, reject) => {
					setTimeout(() => {
						//console.log(`${limit.delay} done -> go on`);
						fullfill(this._processRequest(request, oldRequest));
					}, limit.delay);
				});
			}
		}

		//console.log(`-> normal`);
		this.ongoingRequests += 1;

		return this._processRequest(request, oldRequest);
	}

	_processRequest(request, oldRequest) {
		const currentResponse = this.connected.receive(request, oldRequest).then(resolved => {
			this.ongoingResponses.delete(currentResponse);
			this.ongoingRequests -= 1;
			return resolved;
		}).catch(rejected => {
			this.ongoingResponses.delete(currentResponse);
			this.ongoingRequests -= 1;
			return rejected;
		});

		this.ongoingResponses.add(currentResponse);

		return currentResponse;
	}
}

module.exports = LimitingInterceptor;
