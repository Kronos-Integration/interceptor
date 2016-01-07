/* global describe, it, xit */
/* jslint node: true, esnext: true */

"use strict";

const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should(),
  llm = require('loglevel-mixin'),
  Interceptor = require('../index').Interceptor,
  RequestTimeOut = require('../index').RequestTimeOut;

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

describe('Create Interceptor', function () {
  it('Without config', function () {
    const ic = new Interceptor(dummyEndpoint('ep1'));
    assert.ok(ic);
  });
});

describe('interceptor', function () {
  const ep = dummyEndpoint('ep');

  describe('RequestTimeOut', function () {
    const i1 = new RequestTimeOut(ep, {
      timeout: 10
    });

    it('prototype has a type', function () {
      assert.equal(RequestTimeOut.type, "timeout");
    });
    it('has a type', function () {
      assert.equal(i1.type, "timeout");
    });

    i1.connected = dummyEndpoint('ep');
    i1.connected.receive = request => {
      return new Promise((fullfilled, rejected) => {
        setTimeout(() => fullfilled(request), 10);
      })
    };

    xit('long running timout request', function (done) {
      let response = i1.receive("request", 5);
      response.then(resolved => {
        console.log(`resolved ${resolved}`);
      }).catch(rejected => {
        console.log(`got timeout ? ${rejected}`);
        done();
      });
    });

    xit('passing timout request', function (done) {
      let response = i1.receive("request", 100);
      response.then(resolved => {
        console.log(`resolved ${resolved}`);
      }).catch(rejected => {
        console.log(`got timeout ? ${rejected}`);
        done();
      });
    });
  });
});
