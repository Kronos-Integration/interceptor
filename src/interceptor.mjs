import {
  addType,
  assign,
  extract,
  type_attribute,
  SCOPE_RUNTIME
} from "pacc";

/**
 * @typedef {Object} Endpoint
 */

/**
 * Base interceptor. The base class for all the interceptors
 * Calls configure() and reset().
 * @param {Object?} config The interceptor configuration object.
 */
export class Interceptor {
  /**
   * Meta description of the configuration
   * @return {Object}
   */
  static attributes = {
    type: type_attribute
  };

  static {
    addType(this);
  }

  /**
   *
   * @param {Object} [config]
   */
  constructor(config) {
    this.configure(config);
    this.reset();
  }

  /**
   * The instance method returning the type.
   * Defaults to the constructors name (class name)
   * @return {string}
   */
  get type() {
    return this.constructor.name;
  }

  /**
   * Takes attribute values from config parameters
   * and copies them over to the object.
   * Copying is done according to attributes.
   * Which means we loop over all configuration attributes
   * and then for each attribute decide if we use the default, call
   * a setter function or simply assign the attribute value.
   * @param {Object} [config]
   */
  configure(config) {
    assign(this, config);
  }

  toString() {
    return this.type;
  }

  toJSON() {
    return this.toJSONWithOptions({
      includeConfig: true
    });
  }

  /**
   * Deliver the json representation.
   * @return {Object} json representation
   */
  toJSONWithOptions(options) {
    return extract(this, {
      externalNames: true,
      filter: attribute => {
        if (attribute.scope === SCOPE_RUNTIME) {
          return options.includeRuntimeInfo;
        }
        if (attribute.name === "type") {
          return true;
        }

        return (
          options.includeConfig &&
          (options.includePrivate || !attribute.private)
        );
      }
    });
  }

  /**
   * Forget all accumulated information.
   */
  reset() {}

  /**
   * The receive method. This method receives the request from the leading interceptor
   * and calls the trailing interceptor.
   * @param {Endpoint} endpoint
   * @param {Function} next
   * @param {any[]} args the request from the leading interceptor
   * @return {Promise<any>}
   */
  async receive(endpoint, next, ...args) {
    // This is a dummy implementation. Must be overwritten by the derived object.
    return next(...args);
  }
}
