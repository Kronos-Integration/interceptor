import test from "ava";
import {
  dummyEndpoint,
  interceptorTest
} from "@kronos-integration/test-interceptor";
import { MonitoringInterceptor } from "@kronos-integration/interceptor";

test(
  interceptorTest,
  MonitoringInterceptor,
  {
    gracePeriod: "1s",
    settingPeriod: "5s",

    setup: (t, interceptor) => {
      interceptor.check = x => {
        return false;
      };
      interceptor.resolveAction = () => {};
    }
  },
  {
    gracePeriod: 1000,
    settingPeriod: 5000
  },
  dummyEndpoint("ep1"),
  [5],
  async () => 77,
  async (t, interceptor, endpoint, next, result) => {
    t.is(result, 77);
  }
);
