import { setAttributes, getAttributes } from "model-attributes";

/**
 * Base interceptor. The base class for all the interceptors
 * Calls configure() and reset().
 * @param {Object} config The interceptor configuration object.
 */
export class Interceptor {
  /**
   * Meta description of the configuration
   * @return {Object}
   */
  static get configurationAttributes() {
    return {};
  }

  constructor(config) {
    Object.defineProperties(this, {
      config: {
        value: config
      }
    });

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
   * Meta description of the configuration
   * @return {Object}
   */
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
    setAttributes(this, this.configurationAttributes, config);
  }

  toString() {
    return `${this.type}`;
  }

  /**
   * Deliver the json representation
   * @return {Object} json representation
   */
  toJSON() {
    const json = getAttributes(this, this.configurationAttributes);
    json.type = this.type;
    return json;
  }

  /**
   * forget all accumulated information
   */
  reset() {}

  /**
   * The receive method. This method receives the request from the leading interceptor and calls the
   * trailing interceptor
   * @param {any[]} args the request from the leading interceptor
   * @return {Promise}
   */
  async receive(enpoint, next, ...args) {
    // This is a dummy implementation. Must be overwritten by the derived object.
    return next(...args);
  }
}
