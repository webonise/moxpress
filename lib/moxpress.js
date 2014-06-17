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
var path = require('path');
var mime = require('mime');

// Useful Utility Values
var html_verbs = [
  "options", "get", "head", "post", "put", "delete", "trace", "connect"
];
var endsWith = function(string,value) {
  var stringLength = string.length;
  var valueLength = value.length;
  if(stringLength < valueLength) {
    return false;
  } else {
    return stringLength === valueLength + string.lastIndexOf(value);
  }
}

/***********
* MOCK APP *
***********/
var createMockApp = function() {
  var locals = {};
  var routes = {};
  var settings = locals.settings = {};
  var app = {
    set: function(name, value) { return settings[name] = value; },
    get: function(name) { return settings[name]; },
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
    if(endsWith(verb, "s")) {
      verb_storage = verb + "es"; // Yes, optionses.
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
    });
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
    ips: ["127.0.0.1"],
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
  var headers = {};
  var cookies = {};
  var link_values = {};
  return {
    statusCode: null,
    status: function(code) {
      this.statusCode = code; return this;
    },
    set: function(arg1, arg2) {
      if(_.isObject(arg1)) {
        var fields = arg1; // Ignore arg2
        _.extend(headers, fields);
      } else if(_.isString(arg1)) {
        var field = arg1;
        var value = arg2;
        headers[field.toLowerCase()] = value;
      } else {
        throw new Error(
          "No idea how to set header using '" + value + "' (typeof: " + (typeof value) + ")"
        );
      }
    },
    header: function(arg1,arg2) { this.set(arg1,arg2); },
    get: function(field) { return headers[field] || headers[field].toLowerCase(); },
    cookies: cookies,
    cookie: function(name,value,options) {
      cookies[name] = [value,options];
    },
    clearCookie: function(name) {
      cookies[name] = null;
    },
    redirect: function(status,url) {
      if(!_.isNumber(status)) {
        url = status;
        status = 302;
      }
      this.status(status);
      this.redirectUrl = url;
    },
    redirectUrl: null,
    location: function(url) {
      this.locationUrl = url;
    },
    locationUrl: null,
    send: function(status, body) {
      if(!_.isNumber(status)) {
        body = status;
        status = 200;
      }
      if(typeof(body) === "Buffer") {
        this.type('bin');
      } else if(_.isString(body)) {
        this.type('html');
      } else if(_.isObject(body) || _.isArray(body)) {
        this.type('json');
      } else {
        throw new Error("Do not know how to handle '" +
          body + "' (type:" + (typeof body) +
          " as an argument to 'send'");
      }
      this.status(status);
      this.body = body;
    },
    body: null,
    json: function(status, body) {
      if(!_.isNumber(status)) {
        body = status;
        status = 200;
      }
      this.type('json');
      this.status(status);
      this.body = body;
    },
    jsonp: function() {
      throw new Error("We have not implemented 'jsonp' yet. Please do so.");
    },
    type: function(type) {
      this.header('content-type', mime.lookup(type));
    },
    format: function(instructions) {
      this.formatter = instrucitons;
    },
    formatter: null,
    attachment: function(file) {
      this.attachmentFile = file;
      if(file) {
        this.header('content-disposition', 'attachment; filename=' + path.basename(file));
        this.type(file);
      } else {
        this.header('content-disposition', 'attachment');
      }
    },
    attachmentFile: null,
    sendFile: function(filePath, options, fn) {
      this.type(path.basename(filePath));
      if(fn) fn();
    },
    download: function(filePath, fileName, fn) {
      this.attachment(filePath);
      this.header('content-disposition', 'attachment; filename=' + fileName);
      if(fn) fn();
    },
    links: function(new_links) {
      _.extend(link_values, new_links);
    },
    link_values: link_values,
    locals: {},
    render: function(view, locals, callback) {
      if(_.isFunction(locals)) {
        callback = locals;
        locals = {};
      }
      _.extend(this.locals, locals);
      throw new Error("We have not implemented 'render' yet. Please do so.");
    }
  };
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
