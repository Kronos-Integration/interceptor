/* global describe, it, xit */
/* jslint node: true, esnext: true */

"use strict";

const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should(),
  llm = require('loglevel-mixin'),
  Interceptor = require('../index').Interceptor;

const logger = {};
llm.defineLogLevelProperties(logger, llm.defaultLogLevels, llm.defaultLogLevels);


/* simple owner with name */
function nameIt(name) {
  return {get name() {
      return name;
    }
  };
}

describe('Create Interceptor', function () {

  it('Without config', function () {
    const endpoint = {
      "step": logger
    };
    const ic = new Interceptor({});
    assert.ok(ic);

  });

});


// describe('interceptor', function () {
//   const ep = new endpoint.ReceiveEndpoint('ep', nameIt);
//
//   describe('TimoutInterceptor', function () {
//     const i1 = new interceptor.TimeoutInterceptor(ep, {
//       timout: 10
//     });
//
//     it('prototype has a type', function () {
//       assert.equal(interceptor.TimeoutInterceptor.type, "timeout");
//     });
//     it('has a type', function () {
//       assert.equal(i1.type, "timeout");
//     });
//
//     i1.connected = new endpoint.ReceiveEndpoint('r1', nameIt('o1'));
//     i1.connected.receive = request => {
//       return new Promise((fullfilled, rejected) => {
//         setTimeout(() => {
//           fullfilled(request);
//         }, 10);
//       })
//     };
//
//     it('long running timout request', function (done) {
//       let response = i1.receive("request", 5);
//       response.then(resolved => {
//         console.log(`resolved ${resolved}`);
//       }).catch(rejected => {
//         console.log(`got timeout ? ${rejected}`);
//         done();
//       });
//     });
//
//     it('passing timout request', function (done) {
//       let response = i1.receive("request", 100);
//       response.then(resolved => {
//         console.log(`resolved ${resolved}`);
//       }).catch(rejected => {
//         console.log(`got timeout ? ${rejected}`);
//         done();
//       });
//     });
//
//   });
// });
