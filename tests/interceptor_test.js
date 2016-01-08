/* global describe, it, xit */
/* jslint node: true, esnext: true */

"use strict";

const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should(),
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


function testInterceptor(factory, ep, config, type, cb) {
  const itc = new factory(ep, config);

  function checkInterceptor(inst) {
    it('factory has a type', function () {
      assert.equal(factory.type, type);
    });
    it('instance has a type', function () {
      assert.equal(inst.type, type);
    });
    it('has endpoint', function () {
      assert.equal(inst.endpoint, ep);
    });

    if (cb) {
      describe('advanced', function (done) {
        cb(itc, done);
      });
    }
  }

  describe(`${factory.name} creation`, function () {
    describe('without config', function () {
      checkInterceptor(new factory(ep));
    });

    describe('with config', function () {
      checkInterceptor(itc);
    });
  });

  return itc;
}

describe('interceptors', function () {
  const ep = dummyEndpoint('ep');

  testInterceptor(Interceptor, ep, {}, "none");
  testInterceptor(TimeLoggerInterceptor, ep, {}, "logger-request-time");
  testInterceptor(LimitingInterceptor, ep, {}, "request-limit");

  const itc = testInterceptor(TimeoutInterceptor, ep, {
    timeout: 10
  }, "timeout", (itc, done) => {
    //done();
  });

  itc.connected = dummyEndpoint('ep');
  itc.connected.receive = request => {
    return new Promise((fullfilled, rejected) => {
      setTimeout(() => fullfilled(request), 10);
    })
  };

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
