/* global describe, it, xit */
/* jslint node: true, esnext: true */

'use strict';

const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should(),
  kti = require('kronos-test-interceptor'),
  llm = require('loglevel-mixin'),
  Interceptor = require('../index').Interceptor,
  StatsCollectorInterceptor = require('../index').StatsCollectorInterceptor,
  TimeoutInterceptor = require('../index').TimeoutInterceptor,
  LimitingInterceptor = require('../index').LimitingInterceptor;

const mochaInterceptorTest = kti.mochaInterceptorTest,
  testResponseHandler = kti.testResponseHandler;

const logger = {
  debug(a) {
    console.log(a);
  }
};

/* simple owner with name */
function dummyEndpoint(name) {
  return {get name() {
      return name;
    },
    toString() {
      return this.name;
    },
    step: logger
  };
}

describe('interceptors', () => {
  const ep = dummyEndpoint('ep');

  mochaInterceptorTest(Interceptor, ep, {}, 'none', (itc, withConfig) => {
    if (!withConfig) return;

    itc.connected = dummyEndpoint('ep');

    // request value is the timeout
    itc.connected.receive = testResponseHandler;

    it('passing request', () => itc.receive({
      delay: 1
    }));

    describe('json', () => {
      it('toJSON', () => {
        assert.deepEqual(itc.toJSON(), {
          type: 'none'
        });
      });
    });
  });

  mochaInterceptorTest(StatsCollectorInterceptor, ep, {}, 'collect-request-stats', (itc, withConfig) => {
    if (!withConfig) return;

    itc.connected = dummyEndpoint('ep');

    itc.connected.receive = testResponseHandler;

    describe('count requests', () =>
      it('passing request', () => itc.receive({
        delay: 10
      }).then(fullfilled => {
        assert.equal(itc.numberOfRequests, 1);
        assert.equal(itc.numberOfFailedRequests, 0);
        assert.closeTo(itc.maxRequestProcessingTime, 10, 10);
        assert.closeTo(itc.minRequestProcessingTime, 10, 10);
        assert.closeTo(itc.totalRequestProcessingTime, 10, 10);
      })));

    describe('count failed requests', () => {
      it('failing request', () => itc.receive({
        delay: 2,
        reject: true
      }).then(fullfilled =>
        Promise.reject(new Error('epected to be not fullfilled')),
        rejected => {
          assert.equal(itc.numberOfRequests, 2);
          assert.equal(itc.numberOfFailedRequests, 1);
        }
      ));
    });

    describe('json', () => {
      it('toJSON', () => {
        assert.deepEqual(itc.toJSON(), {
          type: 'collect-request-stats'
        });
      });
    });
  });


  const REQUEST_LIMIT = 2;

  mochaInterceptorTest(LimitingInterceptor, ep, {
    limits: [{
      count: REQUEST_LIMIT * 2,
    }, {
      count: REQUEST_LIMIT,
      delay: 10
    }]
  }, 'request-limit', (itc, withConfig) => {

    describe('json', () => {
      it('toJSON', () => {
        if (withConfig) {
          assert.deepEqual(itc.toJSON(), {
            type: 'request-limit',
            limits: [{
              count: 4
            }, {
              count: 2,
              delay: 10
            }]
          });
        } else {
          assert.deepEqual(itc.toJSON(), {
            type: 'request-limit',
            limits: [{
              count: 10
            }]
          });
        }
      });
    });

    if (!withConfig) {
      it('has limits', () => assert.equal(itc.limits[0].count, 10));
      return;
    }

    it('has limits', () => assert.equal(itc.limits[0].count, REQUEST_LIMIT * 2));

    itc.connected = dummyEndpoint('ep');

    itc.connected.receive = testResponseHandler;

    if (withConfig) {
      it('sending lots of request', done => {
        let i;
        let numberOfFullfilled = 0;

        for (i = 0; i < (REQUEST_LIMIT * 2) + 1; i++) {
          const response = itc.receive({
            delay: 100,
            reject: i === 2,
            id: i
          }).then(
            f => {
              numberOfFullfilled += 1;
              //console.log(`fullfilled: ${f.id}`);
            },
            r => {
              if (r.id === 2) {
                console.log(`**** rejected: ${r.id}`);
              }
              //console.log(`rejected: ${r.id}`);

              if (i >= REQUEST_LIMIT * 2) {
                // wait for the first normal request to go trough
                setTimeout(() => {
                  assert.equal(numberOfFullfilled, REQUEST_LIMIT * 2);
                  done();
                }, 190);
              }
            }
          );
          //console.log(`send: ${i} ${itc.ongoingResponses.size}`);
        }
      });
    }
  });

  mochaInterceptorTest(TimeoutInterceptor, ep, {
    timeout: 15
  }, 'timeout', (itc, withConfig) => {

    describe('json', () => {
      it('toJSON', () => {
        if (withConfig) {
          assert.deepEqual(itc.toJSON(), {
            type: 'timeout',
            timeout: 15
          });
        } else {
          assert.deepEqual(itc.toJSON(), {
            type: 'timeout',
            timeout: 1000
          });
        }
      });
    });

    if (!withConfig) {
      it('has timeout', () => assert.equal(itc.timeout, 1000));
      return;
    }

    it('has timeout', () => assert.equal(itc.timeout, 15));

    itc.connected = dummyEndpoint('ep');

    // request value is the timeout
    itc.connected.receive = testResponseHandler;

    it('passing request within time', done => {
      const response = itc.receive({
        delay: 5
      }); // wait 5 msecs then fullfill
      response.then(resolved => {
        done();
      }).catch(rejected => {
        //console.log(`got timeout ? ${rejected}`);
        done(rejected);
      });
    });

    it('rejecting long running request', done => {
      const response = itc.receive({
        delay: 100
      }); // wait 100 msecs then fullfill -> timeout
      response.then(resolved => {
        console.log(`resolved ${resolved}`);
      }).catch(rejected => {
        //console.log(`got timeout ? ${rejected}`);
        done();
      });
    });

    it('handle rejecting request in time', done => {
      const response = itc.receive({
        reject: true
      }); // produce rejecting response
      response.then(resolved => {
        done();
      }).catch(rejected => {
        //console.log(`got timeout ? ${rejected}`);
        done();
      });
    });

    it('handle rejecting long running request', done => {
      const response = itc.receive({
        delay: 1000,
        reject: true
      }); // produce rejecting response
      response.then(resolved => {
        done();
      }).catch(rejected => {
        //console.log(`got timeout ? ${rejected}`);
        done();
      });
    });
  });
});
