/* jslint node: true, esnext: true */
'use strict';

// The mixin contains the base methods for endpoints and mixins
const connectorMixin = require('./connector-mixin').connectorMixin;

class _DummyInterceptor {}

/**
 * Base interceptor. The base class for all the interceptors
 */
class Interceptor extends connectorMixin(_DummyInterceptor) {

  /**
   * The type under which the interceptor will be registered.
   */
  static get name() {
    return 'none';
  }

  /**
   * The instance method returning the type
   */
  get type() {
    return this.constructor.name;
  }

  /**
   * Creates a new interceptor
   * @param endpoint {object} the endpoint object this interceptor will be attached to.
   * @param config {object} The interceptor configuration object.
   */
  constructor(config, endpoint) {
    super();

    const props = {
      endpoint: {
        value: endpoint
      },
      logger: {
        value: endpoint.step
      },
      config: {
        value: config
      }
    };

    Object.defineProperties(this, props);
  }

  toString() {
    return `${this.endpoint}[${this.type}]`;
  }

  /**
   * Deliver the json representation
   * @return {Object} json representation
   */
  toJSON() {
    return {
      type: this.type
    };
  }

  /**
   * forget all accumulated information
   */
  reset() {}

  /**
   * The receive method. This method receives the request from the leading interceptor and calls the
   * trailing interceptor
   * @param request {object} the request from the leading interceptor
   * @param oldRequest {object} the oldRequest from the leading interceptor.
   *        This is a special case. As some interceptors are in charge of copying and creating the
   *        request objects, the step will call the interceptor chain with the both requests.
   *        At some point of the interceptor chain only the request itself will survive.
   *        But all interceptors designed to be inserted early in the interceptor chain of a sending
   *        endpoint should pass both requests to the next interceptor.
   */
  receive(request, oldRequest) {
    // This is a dummy implementation. Must be overwritten by the derived object.
    return this.connected.receive(request, oldRequest);
  }
}

module.exports.Interceptor = Interceptor;
