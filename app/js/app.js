'use strict';

require("css-loader!../css/tacit.min.css");
require("css-loader!../css/learnflow.css");

const $ = require('jquery');
const _ = require('underscore');

const Backbone = require('backbone');
Backbone.$ = $;

const Syphon = require('backbone.syphon');
Backbone.Syphon = Syphon; 

const cytoscape = require('cytoscape');
const moment = require('moment');

var LearnflowApp = {
    Views: {},
    Models: {},
    Collections: {},
    Router: {}
};

$(document).ready(function(){
    LearnflowApp.Router.Instance = new LearnflowApp.Router();    
    Backbone.history.start();
});

LearnflowApp.Collections.Nodes = Backbone.Collection.extend({
    initialize: function(options) {},

    url: function() {
        return "http://localhost:3000/api/nodes";
    },

    parse: function(response) {
        return response;
    }
});

LearnflowApp.Collections.Candidates = Backbone.Collection.extend({
    initialize: function(options) {},

    url: function() {
        return "http://localhost:3000/api/nodes/randomPair";
    },

    parse: function(response) {
        return response;
    }
});

LearnflowApp.Models.Vote = Backbone.Model.extend({
    defaults: {
        first: -1,
        second: -1, 
        type: null,
    },

    url: "http://localhost:3000/api/votes",
});

LearnflowApp.Models.Tree = Backbone.Model.extend({
    urlRoot: "/api/trees",
});

LearnflowApp.Collections.Votes = Backbone.Collection.extend({
    initialize: function(options) {},
    
    model: LearnflowApp.Models.Vote,

    url: "http://localhost:3000/api/votes",
});

LearnflowApp.Views.NodeView = Backbone.View.extend({
    tagName: 'div',
    className: 'item',

    template: _.template($('#node-template').html()),
    
    initialize: function(options) {
        if (options.model)
            this.model = options.model;
    },
    
    render: function(){
        this.$el.html(this.template(this.model.attributes));
        return this;
    }

});

LearnflowApp.Views.VoteView = Backbone.View.extend({
    tagName: 'li',

    template: _.template($('#vote-template').html()),
    
    initialize: function(options) {
        if (options.model)
            this.model = options.model;
    },
    
    render: function(){
        this.$el.html(this.template(this.model.attributes));
        return this;
    }
});

LearnflowApp.Views.Home = Backbone.View.extend({
    initialize: function(options) {},

    template: _.template($('#home-template').html()),
    
    render: function() {
        this.$el.html(this.template({}));
        return this;
    }
});

LearnflowApp.Router = Backbone.Router.extend({
    routes: {
        'home': 'home',
        'trees/all': 'tree',
        'nodes/all': 'nodelist',
        'votes/all': 'votelist',
        'voting': 'voting',
        '*path': 'home'
    },

    home: function(){
        var view = new LearnflowApp.Views.Home();
        $('#main').html(view.render().el);
    },

    nodelist: function(){
        var view = new LearnflowApp.Views.NodeList();
        $('#main').html(view.render().el);
    },

    votelist: function(){
        var view = new LearnflowApp.Views.VoteList();
        $('#main').html(view.render().el);
    },

    voting: function(){
        var view = new LearnflowApp.Views.Voting();
        $('#main').html(view.render().el);
    },

    tree: function(){
        var view = new LearnflowApp.Views.Tree();
        $('#main').html(view.render().el);
    }
});


LearnflowApp.Views.Tree = Backbone.View.extend({
    initialize: function(options) {
        this.getTree();
    },
    
    treeTemplate: $('#tree-template').html(),
    
    render: function() {
        this.$el.html(this.treeTemplate);
        return this;
    },

    renderTree: function(tree){
        console.log(tree.attributes.elements);

        var cy = cytoscape({
          container: this.$el.find('div#cy'), // container to render in

          elements: tree.attributes.elements,

          style: [ // the stylesheet for the graph
            {
              selector: 'node',
              style: {
                'background-color': '#666',
                'label': 'data(id)'
                }
            },

            {
              selector: 'edge',
              style: {
                'width': 'data(weight)',
                'line-color': '#ccc',
                'target-arrow-color': '#111',
                'target-arrow-shape': 'triangle',
                'curve-style': 'bezier',
              }
            }
          ],
        });

        var layout = cy.layout({
            name: 'breadthfirst'
        });

        layout.run();
    },

    getTree: function(){
        var tree = new LearnflowApp.Models.Tree();
        tree.fetch({success: this.renderTree.bind(this)});
    }
});

LearnflowApp.Views.VoteList = Backbone.View.extend({
    initialize: function(options) {
        this.getVotes();
    },
    
    template: $('#vote-list-template').html(),
    treeTemplate: $('#tree-template').html(),
    
    render: function() {
        this.$el.html(this.template);
        return this;
    },

    renderVotes: function(votes) {
        var voteview;
        for (var n in votes.models) {
            voteview = new LearnflowApp.Views.VoteView({
                model: votes.models[n]
            });

            this.$el.find('#vote-list').append(voteview.render().el);
        }

        // todo: promises
        this.renderTree(votes);
    },

    getVotes: function(){
        var votes = new LearnflowApp.Collections.Votes();
        votes.fetch({success: this.renderVotes.bind(this)});
    }
});


LearnflowApp.Views.NodeList = Backbone.View.extend({
    template: $('#node-list-template').html(),

    initialize: function(options) {
        this.getNodes();
    },
                
    render: function() {
        this.$el.html(_.template(this.template, {}));
        return this;
    },
    
    renderNodes: function(nodes) {
        var nodeview;

        for (var n in nodes.models) {
            nodeview = new LearnflowApp.Views.NodeView({
                model: nodes.models[n]
            });

            this.$el.find('#node-deck').append(nodeview.render().el);
        }
    },

    getNodes: function(){
        var nodes = new LearnflowApp.Collections.Nodes();
        nodes.fetch({success: this.renderNodes.bind(this)});
    }            
});

LearnflowApp.Views.Voting = Backbone.View.extend({
    initialize: function(options) {
        this.getCandidates();
    },

    template: _.template($('#voting-template').html()),

    events: {
        "submit": "formSubmitted",
    },

    render: function() {
        this.$el.html(this.template({}));
        return this;
    },

    renderCandidates: function(nodes) {
        var firstview, secondview;
        var ids = [];

        ids.push(Number(nodes.models[0].attributes._id));
        ids.push(Number(nodes.models[1].attributes._id));

        firstview = new LearnflowApp.Views.NodeView({
            model: nodes.models[0]
        });

        secondview = new LearnflowApp.Views.NodeView({
            model: nodes.models[1]
        });

        this.$el.find('#form-holder').before(firstview.render().el);
        this.$el.find('#form-holder').after(secondview.render().el);


        this.$el.find('form > fieldset > input#first').val(ids[0]);
        this.$el.find('form > fieldset > input#second').val(ids[1]);
    },

    getCandidates: function(){
        var candidates = new LearnflowApp.Collections.Candidates();
        // readup on this API
        candidates.fetch({success: this.renderCandidates.bind(this)});
    },

    formSubmitted: function(event){
        // catch submit event and prevent default behavior
        event.preventDefault();

        var data = Backbone.Syphon.serialize(this);

        var new_vote = new LearnflowApp.Models.Vote();
        new_vote.set(data);
        new_vote.save();

        this.$el.find("form").hide();
        this.$el.find("form").after("<h3>Submitted!</h3><p><a href='javascript:window.location.reload(true)'>Vote again</a></p>");

    },
});
