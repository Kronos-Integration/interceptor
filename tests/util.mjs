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

export function dummyEndpoint(name,owner=logger) {
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
  async receive(...args) {
  }
};
