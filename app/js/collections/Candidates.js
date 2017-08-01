const Backbone = require('backbone');

module.exports = Backbone.Collection.extend({
  initialize: function(options) {},

  url: function() {
    return '/api/nodes/randomPair';
  },

  parse: function(response) {
    return response;
  }
});