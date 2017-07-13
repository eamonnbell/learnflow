const $ = require('jquery');
const Backbone = require('backbone');
Backbone.$ = $;

const _ = require('underscore');

const Syphon = require('backbone.syphon');
Backbone.Syphon = Syphon;

const cytoscape = require('cytoscape');
const moment = require('moment');

const Tree = require('../models/Tree');
const Vote = require('../models/Vote');
const User = require('../models/User');

const Votes = require('../collections/Votes');
const Nodes = require('../collections/Nodes');
const Candidates = require('../collections/Candidates');

var NodeView = Backbone.View.extend({
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

var VoteView = Backbone.View.extend({
  tagName: 'li',

  template: _.template($('#vote-template').html()),
  
  initialize: function(options) {
    if (options.model)
      this.model = options.model;
  },
  
  render: function(){
    var vote = {};
    // mix moment into the model object so that it's available
    // in the template scope
    Object.assign(vote, this.model.attributes, {moment: moment});

    this.$el.html(this.template(vote));
    return this;
  }
});

var Home = Backbone.View.extend({
  initialize: function(options) {},

  template: _.template($('#home-template').html()),

  getSignedInMessage: function(){
    var authToken = window.sessionStorage.getItem('authToken');
    if (authToken) {
      return authToken + ' is home';
    } else {
      return 'no authToken set';
    }
  },
  
  render: function() {
    this.$el.html(this.template({message: this.getSignedInMessage()}));
    return this;
  }
});

var Signup = Backbone.View.extend({
  initialize: function(options) {},

  template: _.template($('#signup-template').html()),

  events: {
    "submit": "formSubmitted",
  },
  
  render: function() {
    this.$el.html(this.template({}));
    return this;
  },

  formSubmitted: function(event){
    // catch submit event and prevent default behavior
    event.preventDefault();

    var data = Backbone.Syphon.serialize(this);

    var user = new User();
    user.set(data);
    user.save();

    this.$el.find('form').hide();
    // TODO rewrite as component
    this.$el.find('form').after("New user submitted.");

  },
});

var Login = Backbone.View.extend({
  initialize: function(options) {},

  template: _.template($('#login-template').html()),

  events: {
    "submit": "formSubmitted",
  },
  
  render: function() {
    this.$el.html(this.template({}));
    return this;
  },

  formSubmitted: function(event){
    // catch submit event and prevent default behavior
    event.preventDefault();

    var data = Backbone.Syphon.serialize(this);

    $.ajax({
      url: '/api/auth/authenticate',
      type: 'POST',
      dataType: 'json',
      data: data,
      success: function(response){
        if (response){
          console.log('setting authToken in sessionStorage...');
          window.sessionStorage.setItem('authToken', response.id_token);
          console.log('set authToken in sessionStorage.');
        } else {
          console.log('problem: ' + response);
        }
      }
    });

    this.$el.find('form').hide();
    this.$el.find('form').after("Credentials submitted.");

  },
});

var TreeView = Backbone.View.extend({
  initialize: function(options) {
    this.getTree();
  },
  
  treeTemplate: $('#tree-template').html(),
  
  render: function() {
    this.$el.html(this.treeTemplate);
    return this;
  },

  renderTree: function(tree){
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
    var tree = new Tree();
    tree.fetch({success: this.renderTree.bind(this)});
  }
});

var VoteList = Backbone.View.extend({
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
      voteview = new VoteView({
        model: votes.models[n]
      });

      this.$el.find('#vote-list').append(voteview.render().el);
    }
  },

  getVotes: function(){
    var votes = new Votes();
    votes.fetch({success: this.renderVotes.bind(this)});
  }
});

var NodeList = Backbone.View.extend({
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
      nodeview = new NodeView({
        model: nodes.models[n]
      });

      this.$el.find('#node-deck').append(nodeview.render().el);
    }
  },

  getNodes: function(){
    var nodes = new Nodes();
    nodes.fetch({success: this.renderNodes.bind(this)});
  }            
});

var Voting = Backbone.View.extend({
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

    firstview = new NodeView({
      model: nodes.models[0]
    });

    secondview = new NodeView({
      model: nodes.models[1]
    });

    this.$el.find('#form-holder').before(firstview.render().el);
    this.$el.find('#form-holder').after(secondview.render().el);


    this.$el.find('form > fieldset > input#first').val(ids[0]);
    this.$el.find('form > fieldset > input#second').val(ids[1]);
  },

  getCandidates: function(){
    var candidates = new Candidates();
    // TODO understand Fetch API
    candidates.fetch({success: this.renderCandidates.bind(this)});
  },

  formSubmitted: function(event){
    // catch submit event and prevent default behavior
    event.preventDefault();

    var data = Backbone.Syphon.serialize(this);

    var new_vote = new Vote();
    new_vote.set(data);
    new_vote.save();

    this.$el.find('form').hide();
    // TODO rewrite as component
    this.$el.find('form').after("<h3>Submitted!</h3><p><a href='javascript:window.location.reload(true)'>Vote again</a></p>");

  },
});

module.exports = {
  NodeView: NodeView,
  VoteView: VoteView,
  Home: Home,
  Signup: Signup,
  Login: Login,
  TreeView: TreeView,
  NodeList: NodeList,
  VoteList: VoteList,
  Voting: Voting
};