import { addType, expand, object_attribute_writable } from "pacc";
import { Interceptor } from "./interceptor.mjs";

/**
 * Map params into requests.
 */
export class TemplateInterceptor extends Interceptor {
  /**
   * @return {string} 'template'
   */
  static get name() {
    return "template";
  }

  static attributes = {
    request: {
      ...object_attribute_writable,
      name: "request",
      description: "request template",
      default: {}
    }
  };

  static {
    addType(this);
  }

  toJSONWithOptions(options) {
    const json = super.toJSONWithOptions(options);
    json.request = this.request;
    return json;
  }

  async receive(endpoint, next, params) {
    return next(
      expand(this.request, { current: params, leadIn: "{{", leadOut: "}}" })
    );
  }
}
