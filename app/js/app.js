'use strict';

require("../css/tacit.min.css");
require("../css/learnflow.css");

var $ = require('jquery');
var Backbone = require('backbone');

Backbone.$ = $;

var _ = require('underscore');

var Router = require('./router');
var router = new Router();

// attach notification dispatcher to Backbone object
var notifications = require('./notifications');
Backbone.Notifications = notifications;

// patch bearer token into Backbone sync
var _sync = Backbone.sync;
Backbone.sync = function(method, model, options) {
  options.headers =  {
    'Authorization': 'Bearer ' + window.sessionStorage.getItem('authToken')
  };

  _sync(method, model, options);
};

Backbone.history.start();