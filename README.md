moxpress
========

Useful mocks for unit testing Node.js's Express.

This is an actively-under-development utility that we use internally
at [Webonise Lab](http://www.webonise.com/about/).  It enables us to write tests
for our Express controller code that executes quickly and gives nice, precise
errors.

Usage
-------

*Install*

```bash
npm install --save-dev moxpress
```

*Use*

```javascript
// Perform the import
var mockFactory = require("moxpress");
var mocks = mockFactory();

// Get your hands on the relevant variables
var app = mocks.app;  // Mock Express "app"
var req = mocks.req;  // Mock Express "req"
var res = mocks.res;  // Mock Express "res"

// Execute your test
var ctrl = require("./my/controller"); // Load your controller
ctrl.index(req, res);                  // Call the method
// Assert away
```


Supported APIs
================

`app`
------

* `set`
* `get`
* `enable`
* `disable`
* `enabled`
* `disabled`
* `listen` (does nothing)
* HTTP verb methods
* `all`
* `route`

To retrieve the routes that were created through `all` and the HTTP verb methods,
use the plural of the HTTP verb (`OPTIONS` => `optionses`), which will be an object
whose keys are paths and whose values are callbacks.

`req`
--------

* `params`
* `param`
* `query`
* `cookies`
* `signedCookies`
* `headers`
* `get` (including lowercasing the argument and aliasing 'referrer' to 'referer')
* `header` (alias of `get`)
* `ip` (defaults to `127.0.0.1`)
* `ips` (defaults to list with single element `127.0.0.1`)
* `host` (defaults to `localhost`)
* `fresh` (defaults to `true`)
* `stale` (defaults to `false`)
* `xhr` (defaults to `true`)
* `protocol` (defaults to `http`)
* `secure` (defaults to `false`)
* `subdomains` (defaults to empty array)
* `originalUrl` (defaults to empty string)

`res`
--------

* `statusCode` (holds the `status` value)
* `status`
* `set` (both object and string versions)
* `header`  (alias of `set`)
* `get` (including lowercasing the argument)
* `cookie`
* `clearCookie`
* `cookies` (provides access to cookies as a map of `name` onto `[value,options]` lists)
* `redirect`
* `redirectUrl` (holds the URL which `redirect` redirects to)
* `location`
* `locationUrl` (holds the URL which `location` specifies)
* `send` (in all its various permutations)
* `body` (holds the body assigned by `send`, `json`, etc.)
* `json`
* `type` (uses [node-mime](https://github.com/broofa/node-mime) to do the lookup)
* `format`
* `formatter` (holds the value passed to `format`)
* `attachment`
* `attachmentFile` (holds the value pased to `attachment`
* `sendFile` (both with and without the callback)
* `download` (both with and without the callback)
* `links`
* `link\_values` (holds the values passed to `links`)
* `locals`

Contributing
=============

Don't like the fact that some part of the API isn't implemented? Then feel
free to contribute! This project uses
[GitHub Flow](http://guides.github.com/introduction/flow/index.html), so
fork, branch, and then submit your pull request. No reasonable pull turned away!

The interesting file is `./lib/moxpress.js`.

Note that the response has access to the request and application objects,
and the request has access to the application object, so they can use that
upstream logic as part of the mocking logic.

Other Useful Libraries for Testing
=====================================

* [SuperTest](http://github.com/visionmedia/supertest)
* [Mocha](http://mochajs.org/)
* [Chai](http://chaijs.com/)
* [Proxyquire](http://github.com/thlorenz/proxyquire)
