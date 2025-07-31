import test from "ava";
import {
  dummyEndpoint,
  interceptorTest
} from "@kronos-integration/test-interceptor";
import { LoggingInterceptor } from "@kronos-integration/interceptor";

const e = dummyEndpoint("ep1");

const entries = [];

e.owner = {
  info(a) {
    entries.push(a);
  }
};

test(
  interceptorTest,
  LoggingInterceptor,
  undefined,
  { type: "logging", json: { type: "logging" } },
  e,
  [1, 2],
  () => 77,
  async (t, interceptor, e, next, result) => {
    t.truthy(
      entries.find(e => e.match(/> \[1,2\]/)),
      "request logged"
    );
    t.truthy(
      entries.find(e => e.match(/< 77/)),
      "result logged"
    );
  }
);
