'use strict';

const Boom = require('boom');
const Joi = require('joi');
const Vote = require('../models/vote').Vote;
const config = require('../../config');

var validate = function(decoded, request, callback) {
  return callback(null, true);
};

exports.register = function(server, options, next) {
  server.auth.strategy('jwt', 'jwt', {
    key: config.secret,
    validateFunc: validate,
    verifyOptions: { algorithms: ['HS256'] }
  });

  server.route({
    method: 'GET',
    path: '/api/votes',
    config: {
      auth: 'jwt'
    },
    handler: function(request, reply) {
      Vote.find((err, docs) => {
        if (err) {
          return reply(Boom.wrap(err, 'Internal MongoDB error'));
        }
        reply(docs);
      });
    }
  });

  server.route({
    method: 'POST',
    path: '/api/votes',
    config: {
      validate: {
        params: {
          first: Joi.number(),
          second: Joi.number(),
          type: Joi.string().valid(['before', 'after'])
        }
      }
    },
    handler: function(request, reply) {

      // votes on ids get handled here
      // two types:
      // 1. a -> b "a before b"
      // 2. a <- b "a after b"
      // first={:id}&second={:id}&type={before, after, same}
      // TODO make sure only VAALID ids are pushed on the tree
      var vote = new Vote(request.payload);
      vote.datetime = Date.now();

      vote.save((err, vote) => {
        if(!err) {
          reply(vote).created();
        } else {
          reply(Boom.forbidden("couldn't persist"));
        }
      });

      
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'routes-votes'
};
