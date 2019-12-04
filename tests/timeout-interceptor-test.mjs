import test from "ava";
import { dummyEndpoint, wait, it } from "./util.mjs";
import { TimeoutInterceptor } from "../src/timeout-interceptor.mjs";

const next = async delay => {
  //console.log("REQUEST",delay);
  if (delay < 0) {
    await wait(-delay);
    throw new Error("failed");
  }

  await wait(delay);
  return 77;
};

test(
  it,
  TimeoutInterceptor,
  {
    timeout: 0.015
  },
  {
    timeout: 0.015,
    json: {
      type: "timeout",
      timeout: 0.015
    }
  },
  dummyEndpoint("ep1"),
  [5],
  next,
  async (t, interceptor, endpoint, next, result) => {
    t.is(result, 77);
    
    /*
    await t.throwsAsync(
      () => interceptor.receive(endpoint, next, 5),
      "ep1[timeout] request not resolved within 15ms"
    );
    */
    /*
    await t.throwsAsync(
      () => interceptor.receive(endpoint, next, -5000),
      "ep1[timeout] request not resolved within 15ms"
    );
*/
    /*
    await t.throwsAsync(
      () => interceptor.receive(endpoint, next, -1),
      "failed"
    );
    */
  }
);
