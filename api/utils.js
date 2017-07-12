'use strict';

const bcrypt = require('bcrypt');
const Boom = require('boom');
const User = require('./models/user').User;
const jwt = require('jsonwebtoken');

const config = require('../config');

function hashPassword(password, callback) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      return callback(err, hash);
    });
  });
}

function verifyUniqueUser(req, res) {
  User.findOne({
    username: req.payload.username
  }, (err, user) => {
    if (user) {
      if (user.username === req.payload.username) {
        res(Boom.badRequest('Username taken'));
      }
    }
    res(req.payload);
  });
}

function createToken(user){
  let scopes;
  if (user.admin) {
    scopes = 'admin';
  }

  return jwt.sign({
    id: user._id,
    username: user.username,
    scope: scopes
  }, config.secret, {
    algorithm: 'HS256',
    expiresIn: '1h'
  });
}

module.exports = {
  hashPassword: hashPassword,
  verifyUniqueUser: verifyUniqueUser,
  createToken: createToken
};