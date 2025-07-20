import { Interceptor } from "./interceptor.mjs";
import { prepareAttributesDefinitions } from "pacc";
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

  static attributes = prepareAttributesDefinitions({
    request: {
      description: "request template",
      default: {},
      type: "object"
    },
    ...Interceptor.attributes
  });

  async receive(endpoint, next, params) {
    return next(expand(this.request, params));
  }
}
