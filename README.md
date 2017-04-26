[![npm](https://img.shields.io/npm/v/kronos-interceptor.svg)](https://www.npmjs.com/package/kronos-interceptor)
[![Greenkeeper](https://badges.greenkeeper.io/Kronos-Integration/kronos-interceptor.svg)](https://greenkeeper.io/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/Kronos-Integration/kronos-interceptor)
[![Build Status](https://secure.travis-ci.org/Kronos-Integration/kronos-interceptor.png)](http://travis-ci.org/Kronos-Integration/kronos-interceptor)
[![bithound](https://www.bithound.io/github/Kronos-Integration/kronos-interceptor/badges/score.svg)](https://www.bithound.io/github/Kronos-Integration/kronos-interceptor)
[![codecov.io](http://codecov.io/github/Kronos-Integration/kronos-interceptor/coverage.svg?branch=master)](http://codecov.io/github/Kronos-Integration/kronos-interceptor?branch=master)
[![Coverage Status](https://coveralls.io/repos/Kronos-Integration/kronos-interceptor/badge.svg)](https://coveralls.io/r/Kronos-Integration/kronos-interceptor)
[![Code Climate](https://codeclimate.com/github/Kronos-Integration/kronos-interceptor/badges/gpa.svg)](https://codeclimate.com/github/Kronos-Integration/kronos-interceptor)
[![Known Vulnerabilities](https://snyk.io/test/github/Kronos-Integration/kronos-interceptor/badge.svg)](https://snyk.io/test/github/Kronos-Integration/kronos-interceptor)
[![GitHub Issues](https://img.shields.io/github/issues/Kronos-Integration/kronos-interceptor.svg?style=flat-square)](https://github.com/Kronos-Integration/kronos-interceptor/issues)
[![Stories in Ready](https://badge.waffle.io/Kronos-Integration/kronos-interceptor.svg?label=ready&title=Ready)](http://waffle.io/Kronos-Integration/kronos-interceptor)
[![Dependency Status](https://david-dm.org/Kronos-Integration/kronos-interceptor.svg)](https://david-dm.org/Kronos-Integration/kronos-interceptor)
[![devDependency Status](https://david-dm.org/Kronos-Integration/kronos-interceptor/dev-status.svg)](https://david-dm.org/Kronos-Integration/kronos-interceptor#info=devDependencies)
[![docs](http://inch-ci.org/github/Kronos-Integration/kronos-interceptor.svg?branch=master)](http://inch-ci.org/github/Kronos-Integration/kronos-interceptor)
[![downloads](http://img.shields.io/npm/dm/kronos-interceptor.svg?style=flat-square)](https://npmjs.org/package/kronos-interceptor)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

kronos-interceptor
=====
introspects / modifies requests as they pass between endpoints

<!-- skip-example -->
```javascript
const ki = require('kronos-interceptor');

const endpoint = { get name() { return 'aName'; }, receive() {}};
const interceptor1 = new ki.Interceptor({},endpoint);
const interceptor2 = new ki.Interceptor({},endpoint);

interceptor1.connected = interceptor2

const request = {};
const promise = interceptor1.receive(request);
```

# API Reference

* <a name="rejectingReceiver"></a>

## rejectingReceiver()
rejecting receiver used to signal a not present connection
when used always delivers a rejecting promise

**Kind**: global function  

* <a name="ConnectorMixin"></a>

## ConnectorMixin()
Mixin to make endpoints/interceptors connectable
Forms a single linked list

**Kind**: global function  

* <a name="injectNext"></a>

## injectNext(endpoint)
Injects a endpoint after ourselfs.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| endpoint | <code>Endpoint</code> | to be injected (after ourselfs) |


* <a name="removeNext"></a>

## removeNext()
Removes the next element from the chain

**Kind**: global function  

* <a name="configure"></a>

## configure(config)
Takes attribute values from config parameters
and copies them over to the object.
Copying is done according to configurationAttributes
Which means we loop over all configuration attributes
and then for each attribute decide if we use the default, call a setter function
or simply assign the attribute value

**Kind**: global function  

| Param | Type |
| --- | --- |
| config | <code>Object</code> | 


* <a name="toJSON"></a>

## toJSON() ⇒ <code>Object</code>
Deliver the json representation

**Kind**: global function  
**Returns**: <code>Object</code> - json representation  

* <a name="reset"></a>

## reset()
forget all accumulated information

**Kind**: global function  

* <a name="receive"></a>

## receive(request, oldRequest)
The receive method. This method receives the request from the leading interceptor and calls the
trailing interceptor

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| request | <code>object</code> | the request from the leading interceptor |
| oldRequest | <code>object</code> | the oldRequest from the leading interceptor.        This is a special case. As some interceptors are in charge of copying and creating the        request objects, the step will call the interceptor chain with the both requests.        At some point of the interceptor chain only the request itself will survive.        But all interceptors designed to be inserted early in the interceptor chain of a sending        endpoint should pass both requests to the next interceptor. |


* <a name="receive"></a>

## receive()
Logs the time the requests takes

**Kind**: global function  

* <a name="rejectUnlessResolvedWithin"></a>

## rejectUnlessResolvedWithin()
**Kind**: global function  

* * *

install
=======

With [npm](http://npmjs.org) do:

```shell
npm install kronos-interceptor
```

license
=======

BSD-2-Clause
