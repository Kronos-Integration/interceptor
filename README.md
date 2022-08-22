[![npm](https://img.shields.io/npm/v/@kronos-integration/interceptor.svg)](https://www.npmjs.com/package/@kronos-integration/interceptor)
[![License](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)
[![Open Bundle](https://bundlejs.com/badge-light.svg)](https://bundlejs.com/?q=@kronos-integration/interceptor)
[![downloads](http://img.shields.io/npm/dm/@kronos-integration/interceptor.svg?style=flat-square)](https://npmjs.org/package/@kronos-integration/interceptor)
[![GitHub Issues](https://img.shields.io/github/issues/Kronos-Integration/interceptor.svg?style=flat-square)](https://github.com/Kronos-Integration/interceptor/issues)
[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2FKronos-Integration%2Finterceptor%2Fbadge\&style=flat)](https://actions-badge.atrox.dev/Kronos-Integration/interceptor/goto)
[![Styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Known Vulnerabilities](https://snyk.io/test/github/Kronos-Integration/interceptor/badge.svg)](https://snyk.io/test/github/Kronos-Integration/interceptor)
[![Coverage Status](https://coveralls.io/repos/Kronos-Integration/interceptor/badge.svg)](https://coveralls.io/github/Kronos-Integration/interceptor)

# @kronos-integration/interceptor

intercepects / modifies requests as they pass between endpoints

<!-- skip-example -->

```javascript
const { Interceptor } from '@kronos-integration/interceptor';

const endpoint = { get name() { return 'aName'; }, receive() {}};
const interceptor = new Interceptor();

const response = interceptor.receive(endpoint, arg1, arg2);
```

# API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

*   [Interceptor](#interceptor)
    *   [Parameters](#parameters)
    *   [type](#type)
    *   [configurationAttributes](#configurationattributes)
    *   [configure](#configure)
        *   [Parameters](#parameters-1)
    *   [toJSONWithOptions](#tojsonwithoptions)
        *   [Parameters](#parameters-2)
    *   [reset](#reset)
    *   [receive](#receive)
        *   [Parameters](#parameters-3)
    *   [configurationAttributes](#configurationattributes-1)
*   [LimitingInterceptor](#limitinginterceptor)
    *   [Parameters](#parameters-4)
    *   [name](#name)
*   [LoggingInterceptor](#logginginterceptor)
    *   [name](#name-1)
*   [StatsCollectorInterceptor](#statscollectorinterceptor)
    *   [receive](#receive-1)
        *   [Parameters](#parameters-5)
    *   [name](#name-2)
*   [TemplateInterceptor](#templateinterceptor)
    *   [name](#name-3)
*   [TimeoutInterceptor](#timeoutinterceptor)
    *   [name](#name-4)
*   [rejectUnlessResolvedWithin](#rejectunlessresolvedwithin)
    *   [Parameters](#parameters-6)
*   [expand](#expand)
    *   [Parameters](#parameters-7)

## Interceptor

Base interceptor. The base class for all the interceptors
Calls configure() and reset().

### Parameters

*   `config` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** The interceptor configuration object.

### type

The instance method returning the type.
Defaults to the constructors name (class name)

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**&#x20;

### configurationAttributes

Meta description of the configuration.

Returns **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)**&#x20;

### configure

Takes attribute values from config parameters
and copies them over to the object.
Copying is done according to configurationAttributes.
Which means we loop over all configuration attributes
and then for each attribute decide if we use the default, call
a setter function or simply assign the attribute value.

#### Parameters

*   `config` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)**&#x20;

### toJSONWithOptions

Deliver the json representation.

#### Parameters

*   `options` &#x20;

Returns **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** json representation

### reset

Forget all accumulated information.

### receive

The receive method. This method receives the request from the leading interceptor
and calls the trailing interceptor.

#### Parameters

*   `endpoint` **Endpoint**&#x20;
*   `next` **[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)**&#x20;
*   `args` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)\<any>** the request from the leading interceptor

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)**&#x20;

### configurationAttributes

Meta description of the configuration

Returns **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)**&#x20;

## LimitingInterceptor

**Extends Interceptor**

Limits the number of concurrent requests.
Requests can be delayed or rejected.
Sample config:
\[
{ count: 20 },
{ count: 10, delay:  100 },
{ count:  5, delay:   10 }
]
1 -  4 : no delay
5 -  9 : 10ms delay
10 - 19 : 100ms delay
20      : reject
default is to reject when more than 10 requests are on the way

### Parameters

*   `config` &#x20;

### name

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 'request-limit'

## LoggingInterceptor

**Extends Interceptor**

logs args and result

### name

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 'logging'

## StatsCollectorInterceptor

**Extends Interceptor**

Interceptor to collect processing time, number of
processed and failed requests.

### receive

Logs the time the requests takes

#### Parameters

*   `endpoint` &#x20;
*   `args` **...any**&#x20;

### name

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 'collect-request-stats'

## TemplateInterceptor

**Extends Interceptor**

Map params into requests.

### name

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 'template'

## TimeoutInterceptor

**Extends Interceptor**

Rejects a request if it does not resolve in a given time.

### name

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 'timeout'

## rejectUnlessResolvedWithin

Rejects promise when it is not resolved within given timeout.

### Parameters

*   `promise` **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)**&#x20;
*   `timeout` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** in miliseconds
*   `name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**&#x20;

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)**&#x20;

## expand

Expands '{{exp}}' expressions.

### Parameters

*   `value` **any**&#x20;
*   `params` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)**&#x20;

Returns **any** expanded value

# install

With [npm](http://npmjs.org) do:

```shell
npm install @kronos-integration/interceptor
```

# license

BSD-2-Clause
