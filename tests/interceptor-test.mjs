import test from 'ava';
import { interceptorTest } from '@kronos-integration/test-interceptor';
import { Interceptor } from '../src/interceptor.mjs';
import { StatsCollectorInterceptor } from '../src/stats-collector-interceptor.mjs';
import { TimeoutInterceptor } from '../src/timeout-interceptor.mjs';
import { LimitingInterceptor } from '../src/limiting-interceptor.mjs';

const logger = {
  debug(a) {
    console.log(a);
  }
};

function dummyEndpoint(name) {
  return {
    get name() {
      return name;
    },
    toString() {
      return this.name;
    },
    step: logger
  };
}

const testResponseHandler = {
  async receive(request, oldRequest) {
  }
};

test(
  interceptorTest,
  Interceptor,
  dummyEndpoint('ep1'),
  {},
  'Interceptor',
  async (t, interceptor, withConfig) => {
    t.deepEqual(interceptor.toJSON(), {
      type: 'Interceptor'
    });

    if (!withConfig) return;

    interceptor.connected = dummyEndpoint('ep');
    interceptor.connected.receive = testResponseHandler;
    /*
    const response = await interceptor.receive({
      delay: 1
    });
    */
  }
);

test(
  interceptorTest,
  StatsCollectorInterceptor,
  dummyEndpoint('ep1'),
  {},
  'collect-request-stats',
  async (t, interceptor, withConfig) => {
    t.deepEqual(interceptor.toJSON(), {
      type: 'collect-request-stats'
    });

    if (!withConfig) return;

    interceptor.connected = dummyEndpoint('ep');
    interceptor.connected.receive = testResponseHandler;

    /*

    await interceptor.receive({
      delay: 10
    });

    t.is(interceptor.numberOfRequests, 1);
    t.is(interceptor.numberOfFailedRequests, 0);
    t.is(interceptor.maxRequestProcessingTime, 10, 10);
    t.is(interceptor.minRequestProcessingTime, 10, 10);
    t.is(interceptor.totalRequestProcessingTime, 10, 10);

    try {
      await interceptor.receive({
        delay: 2,
        reject: true
      });

      throw new Error('expected to be not fullfilled');
    } catch (e) {
      t.is(interceptor.numberOfRequests, 2);
      t.is(interceptor.numberOfFailedRequests, 1);
    }
    */
  }
);

const REQUEST_LIMIT = 2;

test(
  interceptorTest,
  LimitingInterceptor,
  dummyEndpoint('ep1'),
  {
    limits: [
      {
        count: REQUEST_LIMIT * 2
      },
      {
        count: REQUEST_LIMIT,
        delay: 10
      }
    ]
  },
  'request-limit',
  async (t, interceptor, withConfig) => {
    if (withConfig) {
      t.deepEqual(interceptor.toJSON(), {
        type: 'request-limit',
        limits: [
          {
            count: 4
          },
          {
            count: 2,
            delay: 10
          }
        ]
      });
    } else {
      t.deepEqual(interceptor.toJSON(), {
        type: 'request-limit',
        limits: [
          {
            count: 10
          }
        ]
      });

      t.is(interceptor.limits[0].count, 10);
      return;
    }

    t.is(interceptor.limits[0].count, REQUEST_LIMIT * 2);

    interceptor.connected = dummyEndpoint('ep');

    interceptor.connected.receive = testResponseHandler;
  }
);

/*
      if (withConfig) {
        it('sending lots of request', done => {
          let i;
          let numberOfFullfilled = 0;

          for (i = 0; i < REQUEST_LIMIT * 2 + 1; i++) {
            const response = itc
              .receive({
                delay: 100,
                reject: i === 2,
                id: i
              })
              .then(
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
    }
  );
*/

test(
  interceptorTest,
  TimeoutInterceptor,
  dummyEndpoint('ep1'),
  {
    timeout: 0.015
  },
  'timeout',
  async (t, interceptor, withConfig) => {
    if (withConfig) {
      t.deepEqual(interceptor.toJSON(), {
        type: 'timeout',
        timeout: 0.015
      });
    } else {
      t.deepEqual(interceptor.toJSON(), {
        type: 'timeout',
        timeout: 1
      });

      t.is(interceptor.timeout, 1);
      return;
    }

    t.is(interceptor.timeout, 0.015);

    interceptor.connected = dummyEndpoint('ep');

    interceptor.connected.receive = testResponseHandler;
  }
);

/*
      it('passing request within time', done => {
        const response = itc.receive({
          delay: 5
        }); // wait 5 msecs then fullfill
        response.then(resolved => done()).catch(rejected => done(rejected));
      });

      it('rejecting long running request', done => {
        const response = itc.receive({
          delay: 100
        }); // wait 100 msecs then fullfill -> timeout
        response
          .then(resolved => console.log(`resolved ${resolved}`))
          .catch(rejected => done());
      });

      it('handle rejecting request in time', done => {
        const response = itc.receive({
          reject: true
        }); // produce rejecting response
        response.then(resolved => done()).catch(rejected => done());
      });

      it('handle rejecting long running request', done => {
        const response = itc.receive({
          delay: 1000,
          reject: true
        }); // produce rejecting response
        response.then(resolved => done()).catch(rejected => done());
      });
    }
  );
*/
