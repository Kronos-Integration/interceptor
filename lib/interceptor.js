/* jslint node: true, esnext: true */
'use strict';

// The mixin contains the base methods for endpoints and mixins
const connectorMixin = require('./connector-mixin').connectorMixin,
  mat = require('model-attributes');

class _DummyInterceptor {}

/**
 * Base interceptor. The base class for all the interceptors
 */
class Interceptor extends connectorMixin(_DummyInterceptor) {

  static get configurationAttributes() {
    return {};
  }

  /**
   * Creates a new interceptor.
   * Calls configure() and reset().
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

    this.configure(config);
    this.reset();
  }

  /**
   * The instance method returning the type.
   * Defaults to the constructors name (class name)
   */
  get type() {
    return this.constructor.name;
  }

  get configurationAttributes() {
    return this.constructor.configurationAttributes;
  }

  /**
   * Takes attribute values from config parameters
   * and copies them over to the object.
   * Copying is done according to configurationAttributes
   * Which means we loop over all configuration attributes
   * and then for each attribute decide if we use the default, call a setter function
   * or simply assign the attribute value
   * @param {Object} config
   */
  configure(config) {
    mat.setAttributes(this, this.configurationAttributes, config);
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
