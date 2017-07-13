const Backbone = require('backbone');

module.exports = Backbone.Collection.extend({
  initialize: function(options) {},

  url: function() {
    return 'http://localhost:3000/api/nodes/randomPair';
  },

  parse: function(response) {
    return response;
  }
});