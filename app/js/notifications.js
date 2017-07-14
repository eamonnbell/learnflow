var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;

const _ = require('underscore');

const views = require('./views/views');

var notifications = _.extend({}, Backbone.Events);

notifications.on('flash', function(obj) {
  var notificationview = new views.NotificationView({
    attributes: obj
  });
  $('#notification-area').append(notificationview.render().el);
});

module.exports = notifications;