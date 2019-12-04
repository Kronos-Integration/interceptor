import test from "ava";
import { dummyEndpoint, it } from "./util.mjs";
import { LoggingInterceptor } from "../src/logging-interceptor.mjs";

const e = dummyEndpoint("ep1");

const entries = [];

e.logger = {
  info(a) {
    entries.push(a);
  }
};

test(
  it,
  LoggingInterceptor,
  undefined,
  { type: "logging", json: { type: 'logging'} },
  e,
  [1,2],
  () => 77,
  async (t, interceptor, e, next, result) => {
    t.truthy(entries.find(e => e.match(/request \[1,2\]/)), "request logged");
    t.truthy(entries.find(e => e.match(/result 77/)), "result logged");
  }
);
