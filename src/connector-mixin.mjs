/**
 * rejecting receiver used to signal a none present connection
 * when used always delivers a rejecting promise
 * @return {void} always throws
 */
export async function rejectingReceiver(request) {
  throw new Error('Receiver not defined');
}

/**
 * Mixin to make endpoints/interceptors connectable
 * Forms a single linked list
 */

export function ConnectorMixin(superclass) {
  return class extends superclass {
    set connected(e) {
      this._connected = e;
    }

    get connected() {
      return this._connected;
    }

    get isConnected() {
      return this._connected && this._connected != rejectingReceiver
        ? true
        : false;
    }

    /**
     * Delivers the other end of the connection chain
     * Given:
     * a.connected = b
     * b.connected = c
     * then a.otherEnd === c
     * @return {undefined} if not connected at all
     */
    get otherEnd() {
      let c = this;

      while (c.isConnected) {
        c = c.connected;
      }
      return c === this ? undefined : c;
    }

    /**
     * Injects a endpoint after ourselfs.
     * @param {Endpoint} endpoint to be injected (after ourselfs)
     */
    injectNext(endpoint) {
      endpoint.connected = this.connected;
      this.connected = endpoint;
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
