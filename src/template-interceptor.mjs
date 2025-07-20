import { Interceptor } from "./interceptor.mjs";
import { prepareAttributesDefinitions } from "pacc";
import { expand } from "./util.mjs";

const ATTRIBUTES = prepareAttributesDefinitions({
  request: {
    description: "request template",
    default: {},
    type: "object"
  },
  ...Interceptor.attributes
});

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

  static get attributes() {
    return ATTRIBUTES;
  }

  async receive(endpoint, next, params) {
    return next(expand(this.request, params));
  }
}
