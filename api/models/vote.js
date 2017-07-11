const Mongoose = require('mongoose');

var VoteSchema = new Mongoose.Schema({
  first: { type: Number, required: true },
  second: { type: Number, required: true },
  type: { type: String, required: true},
  datetime: { type: Date, required: true}
});

var vote = Mongoose.model('vote', VoteSchema);

module.exports = {
  Vote: vote
};