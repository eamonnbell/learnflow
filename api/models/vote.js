const Mongoose = require('mongoose');

var VoteSchema = new Mongoose.Schema({
  first: { type: Number, required: true },
  second: { type: Number, required: true }
});

var vote = Mongoose.model('vote', VoteSchema);

module.exports = {
  User: user
};