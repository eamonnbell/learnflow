const $ = require('jquery');
const Backbone = require('backbone');
Backbone.$ = $;

const views = require('./views/views');

module.exports = Backbone.Router.extend({
  routes: {
    'home': 'home',
    'signup': 'signup',
    'login': 'login',
    'trees/all': 'tree',
    'nodes/all': 'nodelist',
    'votes/all': 'votelist',
    'voting': 'voting',
    '*path': 'home'
  },

  home: function(){
    var view = new views.Home();
    $('#main').html(view.render().el);
  },

  signup: function(){
    var view = new views.Signup();
    $('#main').html(view.render().el);
  },

  login: function(){
    var view = new views.Login();
    $('#main').html(view.render().el);
    view.attachParsley();
  },

  nodelist: function(){
    var view = new views.NodeList();
    $('#main').html(view.render().el);
  },

  votelist: function(){
    var view = new views.VoteList();
    $('#main').html(view.render().el);
  },

  voting: function(){
    var view = new views.Voting();
    $('#main').html(view.render().el);
  },

  tree: function(){
    var view = new views.TreeView();
    $('#main').html(view.render().el);
  }
});
