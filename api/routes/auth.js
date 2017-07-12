'use strict';

const bcrypt = require('bcrypt');
const Boom = require('boom');
const Joi = require('joi');

const User = require('../models/user');

const createUserSchema = Joi.object({
  username: Joi.string().alphanum().min(2).max(30).required(),
  password: Joi.string().min(8).required(),
  slogan: Joi.string().max(128)
});

function hashPassword(password, callback) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      return callback(err, hash);
    });
  });
}

module.exports = {
  method: 'POST',
  path: '/api/auth/users',
  
  config: {

    pre: [
      { method: verifyUniqueUser }
    ],

    validate: {
      payload: createUserSchema
    },

    handler: (req, res) => {
      let user = new User();
      user.username = req.payload.email;
      user.slogan = req.payload.slogan;
      user.admin = false;

      hashPassword(req.payload.password, (err, hash) => {
        if (err) {
          throw Boom.badRequest(err);
        }

        user.password = hash;
        user.save((err, user) => {
          if (err) {
            throw Boom.badRequest(err);
          }

          res({ id_token: createToken(user)}).code(201);
        });
      });
    }
  }

}