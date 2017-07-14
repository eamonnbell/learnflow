const Backbone = require('backbone');

const Vote = require('../models/Vote');

module.exports = Backbone.Collection.extend({
  initialize: function(options) {},
  
  model: Vote,

  url: 'http://localhost:3000/api/votes',
});