import test from "ava";
import { dummyEndpoint } from "./util.mjs";
import { interceptorTest } from "@kronos-integration/test-interceptor";
import { LoggingInterceptor } from "../src/logging-interceptor.mjs";

test(
  interceptorTest,
  LoggingInterceptor,
  dummyEndpoint("ep1"),
  undefined,
  "logging",
  async (t, interceptor, withConfig) => {
    t.deepEqual(interceptor.toJSON(), {
      type: "logging"
    });

    interceptor.connected = dummyEndpoint("ep");
    interceptor.connected.receive = () => 77;

    const entries = [];
    interceptor.endpoint.owner = {
      info(a) {
        entries.push(a);
      }
    };

    await interceptor.receive(1, 2);

    t.truthy(entries.find(e => e.match(/request \[1,2\]/)), "request logged");
    t.truthy(entries.find(e => e.match(/result 77/)), "result logged");
  }
);
