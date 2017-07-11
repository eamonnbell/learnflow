const $ = require('jquery');
const Backbone = require('backbone');
Backbone.$ = $;

const views = require('./views/views');

module.exports = Backbone.Router.extend({
    routes: {
        'home': 'home',
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
        var view = new views.Tree();
        $('#main').html(view.render().el);
    }
});
