'use strict';

const Boom = require('boom');
const shuffle = require('shuffle-array');
const Node = require('../models/node').Node;


exports.register = function(server, options, next) {

  // get all nodes
  server.route({
    method: 'GET',
    path: '/api/nodes',
    handler: function (request, reply) {
      Node.find((err, docs) => {
        if (err) {
          return reply(Boom.wrap(err, 'Internal MongoDB error'));
        }

        reply(docs);
      });
    }
  });

  // get single node 
  // use that to tell us what its in rel with
  server.route({
    method: 'GET',
    path: '/api/nodes/{id}',
    handler: function (request, reply) {
      Node.findOne({
        _id: Number(request.params.id)
      }, (err, doc) => {
        if (err) {
          return reply(Boom.wrap(err, 'Internal MongoDB error'));
        }

        if (!doc) {
          return reply(Boom.notFound());
        }

        reply(doc);
      });
    }
  });

  // get two nodes 
  server.route({
    method: 'GET',
    path: '/api/nodes/{id_a}/{id_b}',
    handler: function (request, reply) {
      Node.find({
        _id: {
          $in: [Number(request.params.id_a),
              Number(request.params.id_b)]
        }
      }, (err, docs) => {
        if (err) {
          return reply(Boom.wrap(err, 'Internal MongoDB error'));
        }

        if (!docs || docs.length != 2) {
          return reply(Boom.notFound());
        }

        reply(docs);
      });
    }
  });

  // get two nodes at random
  server.route({
    method: 'GET',
    path: '/api/nodes/randomPair',
    handler: function (request, reply) {
      var distinct_ids;
      var a, b, rest;

      Node.distinct('_id', {}, (err, list) => {
        if (err) {
          return reply(Boom.wrap(err, 'Internal MongoDB error'));
        }

        if (!list) {
          return reply(Boom.notFound());
        }

        shuffle(list);
        [a, b, ...rest] = list;

        return reply().redirect(a + '/' + b);

      });
    } 
  });

  return next();
};

exports.register.attributes = {
  name: 'routes-nodes'
};
