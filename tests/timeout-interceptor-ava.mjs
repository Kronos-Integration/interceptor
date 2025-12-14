import test from "ava";
import {
  dummyEndpoint,
  wait,
  interceptorTest
} from "@kronos-integration/test-interceptor";
import { TimeoutInterceptor } from "@kronos-integration/interceptor";

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
  interceptorTest,
  TimeoutInterceptor,
  {
    timeout: "15s"
  },
  {
    timeout: 15000,
    json: {
      type: "timeout",
      timeout: 15000000 
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
