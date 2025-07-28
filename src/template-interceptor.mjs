import { Interceptor } from "./interceptor.mjs";
import { prepareAttributesDefinitions, default_attribute } from "pacc";
import { expand } from "./util.mjs";

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

  static attributes = prepareAttributesDefinitions(
    {
      request: {
        ...default_attribute,
        type: "object",
        description: "request template",
        default: {}
      }
    },
    Interceptor.attributes
  );

  async receive(endpoint, next, params) {
    return next(expand(this.request, params));
  }
}
