const Backbone = require('backbone');

module.exports = Backbone.Collection.extend({
    initialize: function(options) {},

    url: function() {
        return "http://localhost:3000/api/nodes";
    },

    parse: function(response) {
        return response;
    }
});

