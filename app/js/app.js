'use strict';

require("../css/tacit.min.css");
require("../css/learnflow.css");

const $ = require('jquery');
const Backbone = require('backbone');
Backbone.$ = $;

const _ = require('underscore');

var Router = require('./router');
var router = new Router();

// patch bearer token into Backbone sync
var _sync = Backbone.sync;
Backbone.sync = function(method, model, options) {
  options.headers =  {
    'Authorization': 'Bearer ' + window.sessionStorage.getItem('authToken')
  };

  _sync(method, model, options);
};

Backbone.history.start();