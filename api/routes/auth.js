'use strict';

const Boom = require('boom');
const Joi = require('joi');

const User = require('../models/user').User;
const utils = require('../utils');

const createUserSchema = Joi.object({
  username: Joi.string().alphanum().min(2).max(30).required(),
  password: Joi.string().min(8).required(),
  slogan: Joi.string()
});

const authenticateUserSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

exports.register = function(server, options, next) {
  server.route({

    method: 'POST',
    path: '/api/auth/users',
    
    config: {
      pre: [
        { method: utils.verifyUniqueUser }
      ],
      validate: {
        payload: createUserSchema
      },
      handler: (req, res) => {
        let user = new User();
        user.username = req.payload.username;
        user.slogan = req.payload.slogan;
        user.admin = false;

        utils.hashPassword(req.payload.password, (err, hash) => {
          if (err) {
            throw Boom.badRequest(err);
          }

          user.password = hash;
          user.save((err, user) => {
            if (err) {
              throw Boom.badRequest(err);
            }

            res({ id_token: utils.createToken(user)}).code(201);
          });
        });
      }
    },
  });

  server.route({
    method: 'POST',
    path: '/api/auth/authenticate',
    config: {
      pre: [
        { method: utils.verifyCredentials, assign: 'user' }
      ],
      handler: (req, res) => {
        res({ id_token: utils.createToken(req.pre.user) }).code(201);
      },
      validate: {
        payload: authenticateUserSchema
      }
    }
  });

  return next();
};


exports.register.attributes = {
  name: 'routes-auth'
};
