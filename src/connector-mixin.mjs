/**
 * rejecting receiver used to signal a none present connection
 * when used always delivers a rejecting promise
 * @return {void} always throws
 */
export async function rejectingReceiver() {
  throw new Error('Receiver not defined');
}

/**
 * slot holding the actual connection value
 */
export const CONNECTED = Symbol("connected");

/**
 * @typedef {Object} Connectable 
 * @property {Connectable|undefined} connected
 */

/**
 * Mixin to make endpoints/interceptors connectable
 * Forms a single linked list
 */
export function ConnectorMixin(superclass) {
  return class extends superclass {
    set connected(e) {
      this[CONNECTED] = e;
    }

    get connected() {
      return this[CONNECTED];
    }

    /**
     * @return {boolean} true if we are connected
     */
    get isConnected() {
      return this[CONNECTED] && this[CONNECTED] !== rejectingReceiver
        ? true
        : false;
    }

    /**
     * Injects a connectable after ourselfs.
     * @param {Connectable} connectable to be injected (after ourselfs)
     */
    injectNext(connectable) {
      connectable.connected = this.connected;
      this.connected = connectable;
    }

    /**
     * Removes the next element from the chain
     */
    removeNext() {
      if (this.isConnected) {
        this.connected = this.connected.connected;
      }
    }
  };
}
