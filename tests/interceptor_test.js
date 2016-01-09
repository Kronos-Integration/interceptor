/* global describe, it, xit */
/* jslint node: true, esnext: true */

"use strict";

const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should(),
  mochaInterceptorTest = require('kronos-test-interceptor').mochaInterceptorTest,
  llm = require('loglevel-mixin'),
  Interceptor = require('../index').Interceptor,
  TimeLoggerInterceptor = require('../index').TimeLoggerInterceptor,
  TimeoutInterceptor = require('../index').TimeoutInterceptor,
  LimitingInterceptor = require('../index').LimitingInterceptor;

const logger = {};
llm.defineLogLevelProperties(logger, llm.defaultLogLevels, llm.defaultLogLevels);


/* simple owner with name */
function dummyEndpoint(name) {
  return {get name() {
      return name;
    },
    "step": logger
  };
}

describe('interceptors', function () {
  const ep = dummyEndpoint('ep');

  mochaInterceptorTest(Interceptor, ep, {}, "none");


  mochaInterceptorTest(TimeLoggerInterceptor, ep, {}, "logger-request-time", itc => {});

  mochaInterceptorTest(LimitingInterceptor, ep, {
    limit: 5
  }, "request-limit", itc => {
    it('has limit', function () {
      assert.equal(itc.limit, 5);
    });
  });

  const itc = mochaInterceptorTest(TimeoutInterceptor, ep, {
    timeout: 12345
  }, "timeout", itc => {
    it('has timeout', function () {
      assert.equal(itc.timeout, 12345);
    });

    itc.connected = dummyEndpoint('ep');

    itc.connected.receive = request =>
      new Promise((fullfilled, rejected) =>
        setTimeout(() => fullfilled(request), 10));

    xit('long running timout request', function (done) {
      let response = itc.receive("request", 5);
      response.then(resolved => {
        console.log(`resolved ${resolved}`);
      }).catch(rejected => {
        console.log(`got timeout ? ${rejected}`);
        done();
      });
    });

    xit('passing timout request', function (done) {
      let response = itc.receive("request", 100);
      response.then(resolved => {
        console.log(`resolved ${resolved}`);
      }).catch(rejected => {
        console.log(`got timeout ? ${rejected}`);
        done();
      });
    });
  });
});
