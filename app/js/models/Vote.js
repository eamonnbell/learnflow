const Backbone = require('backbone');

module.exports = Backbone.Model.extend({
    defaults: {
        first: -1,
        second: -1, 
        type: null,
    },

    url: "http://localhost:3000/api/votes",
});