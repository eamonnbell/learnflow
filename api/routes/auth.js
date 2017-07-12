'use strict';

const Boom = require('boom');
const Joi = require('joi');

const User = require('../models/user').User;
const utils = require('../utils');

const createUserSchema = Joi.object({
  username: Joi.string().alphanum().min(2).max(30).required(),
  password: Joi.string().min(8).required(),
  slogan: Joi.string().max(128)
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

  return next();
};


exports.register.attributes = {
  name: 'routes-auth'
};
