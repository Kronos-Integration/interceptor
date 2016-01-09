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
    toString() {
      return this.name;
    },
    "step": logger
  };
}

describe('interceptors', () => {
  const ep = dummyEndpoint('ep');

  mochaInterceptorTest(Interceptor, ep, {}, "none");


  mochaInterceptorTest(TimeLoggerInterceptor, ep, {}, "logger-request-time", itc => {});

  mochaInterceptorTest(LimitingInterceptor, ep, {
    limit: 5
  }, "request-limit", itc => {
    it('has limit', () => assert.equal(itc.limit, 5));
  });

  const itc = mochaInterceptorTest(TimeoutInterceptor, ep, {
    timeout: 15
  }, "timeout", itc => {
    it('has timeout', () => assert.equal(itc.timeout, 15));

    itc.connected = dummyEndpoint('ep');

    // request value is the timeout
    itc.connected.receive = request =>
      new Promise((fullfilled, rejected) =>
        setTimeout(() => fullfilled(request), request));

    it('passing request within time', done => {
      const response = itc.receive(5); // wait 5 msecs then fullfill
      response.then(resolved => {
        done();
      }).catch(rejected => {
        //console.log(`got timeout ? ${rejected}`);
        done(rejected);
      });
    });

    it('rejecting long running request', done => {
      const response = itc.receive(100); // wait 100 msecs then fullfill -> timeout
      response.then(resolved => {
        console.log(`resolved ${resolved}`);
      }).catch(rejected => {
        //console.log(`got timeout ? ${rejected}`);
        done();
      });
    });

  });
});
