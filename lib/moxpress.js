/*
 * moxpress
 * https://github.com/webonise/moxpress
 *
 * Copyright (c) 2014 Webonise Lab
 * Licensed under the Unlicense license.
 */

// First line of every JavaScript file
'use strict';

/****************
* CONFIGURATION *
****************/

// Imports
var _ = require("underscore");

// Useful Shorthand Variables
var html_verbs = [
  "options", "get", "head", "post", "put", "delete", "trace", "connect"
];

/***********
* MOCK APP *
***********/
var createMockApp = function() {
  var locals = {};
  var routes = {};
  var settings = locals.settings = {};
  var app = {
    set: function(name, value) { return settings[name] = value; },
    get: function(name) { return settings[name]; }
    enable: function(name) { return settings[name] = true; },
    disable: function(name) { return settings[name] = false; },
    enabled: function(name) { return settings[name] || false },
    disabled: function(name) { return !(settings[name] || false) },
    use: function() { throw new Error("We have not implemented 'use' yet. Please do so."); },
    engine: function() { throw new Error("We have not implemented 'engine' yet. Please do so."); },
    param: function() { throw new Error("We have not implemented 'param' yet. Please do so."); },
    locals: locals,
    render: function() { throw new Error("We have not implemented 'render' yet. Please do so."); },
    listen: function() {} // Do nothing
  };
  _.each(html_verbs, function(verb) {
    var verb_storage;
    if(verb.endsWith("s")) {
      verb_storage = verb + "es";
    } else {
      verb_storage = verb + "s";
    }
    verb_storage = app[verb_storage] = {};
    app[verb] = function(path, callbacks) {
      callbacks = _.tail(_.toArray(arguments)); // Take multiple callbacks

      // If we already defined this verb, put that on the head of the callbacks
      if(verb_storage[path]) {
        callbacks.unshift(verb_storage[path]);
      }

      // In Express, the callbacks are provided in reverse composition order
      // That is: app.get("/", foo, bar, baz) returns baz(bar(foo(...)))
      verb_storage[path] = _.compose(callbacks.reverse());
    };
  });
  app.all = function(path, callbacks) {
    var args = _.toArray(arguments);
    _.each(html_verbs, function(verb) {
      app[verb](args);
    });
  };
  app.route = function(path) {
    var route = {};
    _.each(html_verbs, function(verb) {
      route[verb] = function(callbacks) {
        var args = _.toArray(arguments);
        args.unshift(path);
        app[verb](args);
      };
    };
    route.all = function(callbacks) {
      args.unshift(path);
      app.all(args);
    };
    return route;
  };
  return app;
};

/***************
* MOCK REQUEST *
***************/

var createMockRequest = function(app) {
  return {
    params: {},
    param: function(name) { return this.param[name]; },
    query: {},
    route: function() {
      throw new Error("We have not implemented 'route' yet. Please do so.");
    },
    cookies: {},
    signedCookies: {},
    headers: {},
    get: function(name) {
      name = name.toLowerCase();
      if(name === "referrer") {
        name = "referer";
      }
      return this.headers[name];
    },
    header: function(name) { this.get(name); },
    accepts: function() {
      throw new Error("We have not implemented 'accepts' yet. Please do so.");
    },
    acceptsCharset: function() {
      throw new Error("We have not implemented 'acceptsCharset' yet. Please do so.");
    },
    acceptsLanguage: function() {
      throw new Error("We have not implemented 'acceptsLanguage' yet. Please do so.");
    },
    is: function() {
      throw new Error("We have not implemented 'is' yet. Please do so.");
    },
    ip: "127.0.0.1",
    ips: [this.ip],
    path: function() {
      throw new Error("We have not implemented 'path' yet. Please do so.");
    },
    host: "localhost",
    fresh: true,
    stale: false,
    xhr: true,
    protocol: "http",
    secure: false,
    subdomains: [],
    originalUrl: ""
  };
};

/****************
* MOCK RESPONSE *
****************/
var createMockResponse = function(app, req) {
};

/**********
* EXPORT  *
***********/

// Object that we are building for export
module.exports = function(me) {
  me = me || {};
  var app = me.app = createMockApp();
  var req = me.req = createMockRequest(app);
  me.res = createMockResponse(app, req);
  return me;
};
