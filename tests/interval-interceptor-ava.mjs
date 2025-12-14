import test from "ava";
import {
  dummyEndpoint,
  interceptorTest
} from "@kronos-integration/test-interceptor";
import { IntervalInterceptor } from "@kronos-integration/interceptor";

test(
  interceptorTest,
  IntervalInterceptor,
  {
    interval: "1s"
  },
  {
    interval: 1000
  },
  dummyEndpoint("ep1"),
  [5],
  async () => 77,
  async (t, interceptor, endpoint, next, result) => {
    t.is(result, 77);
  }
);
