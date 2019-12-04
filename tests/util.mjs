export async function wait(msecs = 1000) {
  return new Promise((resolve, reject) => setTimeout(() => resolve(), msecs));
}

export const logger = {
  debug(a) {
    console.log(a);
  },
  error(a) {
    console.log(a);
  },
  info(a) {
    console.log(a);
  }
};

export function dummyEndpoint(name, owner = logger) {
  return {
    get name() {
      return name;
    },
    toString() {
      return this.name;
    },
    owner
  };
}

export const testResponseHandler = {
  async receive(...args) {}
};

async function dummy() {}

/**
 * @param {ava} t ava test runner
 * @param {Class} Factory interceptor Class
 * @param {Endpoint} endpoint endpoint to assign
 * @param {Object} config to assing
 * @param {string} type type identifier to use
 * @param {Function} further for additional tests
 */
export async function it(
  t,
  factory,
  config,
  expected = {},
  endpoint,
  args = [],
  next = (...args) => 0,
  asserts = () => {}
) {
  const instance = new factory(config);

  instance.reset();

  for (const name of Object.keys(expected)) {
    switch (name) {
      case "json":
        t.deepEqual(instance.toJSON(), expected[name], "json");
        break;
      default:
        t.is(instance[name], expected[name], name);
    }
  }

  const result = await instance.receive(endpoint, next, ...args);

  asserts(t, instance, endpoint, next, result);
}

it.title = (providedTitle, factory, config, expected) =>
  `${providedTitle} ${factory.name} ${JSON.stringify(config)}`.trim();
