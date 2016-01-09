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


  const REQUEST_LIMIT = 1;

  mochaInterceptorTest(LimitingInterceptor, ep, {
    limit: REQUEST_LIMIT
  }, "request-limit", itc => {
    it('has limit', () => assert.equal(itc.limit, REQUEST_LIMIT));

    itc.connected = dummyEndpoint('ep');

    // request value is the timeout
    itc.connected.receive = request =>
      new Promise((fullfilled, rejected) =>
        setTimeout(() => fullfilled(request), 200));

    xit('sending lots of request', done => {
      let i;
      for (i = 0; i < REQUEST_LIMIT + 1; i++) {
        const response = itc.receive(i).then(
          f => {
            console.log(`fullfilled: ${f}`);
          },
          r => {
            console.log(`rejected: ${r}`);

            if (i === REQUEST_LIMIT) {
              done();
            }
          }
        );
        console.log(`send: ${i} ${itc.ongoingResponses.size}`);
      }
    });
  });

  mochaInterceptorTest(TimeoutInterceptor, ep, {
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
