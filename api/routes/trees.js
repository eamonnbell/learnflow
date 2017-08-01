'use strict';

const Boom = require('boom');
const Vote = require('../models/vote').Vote;

exports.register = function(server, options, next) {
  
  const db = server.app.db;

  server.route({
    method: 'GET',
    path: '/api/trees',
    handler: function(request, reply) {
      Vote.find((err, docs) => {
        if (err) {
          return reply(Boom.wrap(err, 'Internal MongoDB error'));
        }

        var response = {};

        var nodes = [];
                
        var edges_and_weights = {};

        for (var item of docs) {
          var first = String(item.first);
          var second = String(item.second);
          var type = String(item.type);
          var edge;
          
          nodes.push(first);
          nodes.push(second);


          if (type == 'before') {
            edge = [first, second];
          } else if (type == 'after') {
            edge = [second, first];
          }

          // remember, key is result of toString() 
          if (edge in edges_and_weights) {
            edges_and_weights[edge] += 1;
          } else {
            edges_and_weights[edge] = 1;
          }
        }

        nodes = [...new Set(nodes)];

        response.elements = [];

        for (var i = 0; i < nodes.length; i++) {
          response.elements.push({ 
            data: { 
              id: nodes[i]
            }
          });
        }

        for (var key in edges_and_weights) {
          response.elements.push({
            data: {
              id: key,
              source: key.split(',')[0],
              target: key.split(',')[1],
              weight: edges_and_weights[key]
            }
          });
        }

        reply(response);
      });
    }
  });


  return next();
};

exports.register.attributes = {
  name: 'routes-tress'
};