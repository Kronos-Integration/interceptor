import test from "ava";
import { dummyEndpoint } from "./util.mjs";
import { interceptorTest } from "@kronos-integration/test-interceptor";
import { TimeoutInterceptor } from "../src/timeout-interceptor.mjs";

export async function wait(msecs = 1000) {
  return new Promise((resolve, reject) => setTimeout(() => resolve(), msecs));
}

test(
  interceptorTest,
  TimeoutInterceptor,
  dummyEndpoint("ep1"),
  {
    timeout: 0.015
  },
  "timeout",
  async (t, interceptor, withConfig) => {
    if (withConfig) {
      t.deepEqual(interceptor.toJSON(), {
        type: "timeout",
        timeout: 0.015
      });
    } else {
      t.deepEqual(interceptor.toJSON(), {
        type: "timeout",
        timeout: 1
      });

      t.is(interceptor.timeout, 1);
      return;
    }

    t.is(interceptor.timeout, 0.015);

    interceptor.connected = dummyEndpoint("ep");
    interceptor.connected.receive = async delay => {
      if (delay < 0) {
        await wait(-delay);
        throw new Error("failed");
      }

      await wait(delay);
      return 77;
    };

    let response;

    response = await interceptor.receive(5);
    t.is(response, 77);

    await t.throwsAsync(
      () => interceptor.receive(5000),
      "ep1[timeout] request not resolved within 15ms"
    );

    await t.throwsAsync(
      () => interceptor.receive(-5000),
      "ep1[timeout] request not resolved within 15ms"
    );

    await t.throwsAsync(() => interceptor.receive(-1), "failed");
  }
);
