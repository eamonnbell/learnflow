'use strict';

const Mongoose = require('mongoose');

const UserSchema = new Mongoose.Schema({
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true, index: { unique: true } },
  slogan: { type: String, required: true },
  admin: { type: Boolean, required: true }
});

var user = Mongoose.model('user', UserSchema);

module.exports = {
  User: user
};