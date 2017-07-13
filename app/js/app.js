'use strict';

require("../css/tacit.min.css");
require("../css/learnflow.css");

const $ = require('jquery');
const Backbone = require('backbone');
Backbone.$ = $;

const _ = require('underscore');

const Syphon = require('backbone.syphon');
Backbone.Syphon = Syphon; 

var Router = require('./router');
var router = new Router();

Backbone.history.start();