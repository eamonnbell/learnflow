const Mongoose = require('mongoose');

var NodeSchema = new Mongoose.Schema({
  _id: { type: Number, required: true},
  title: { type: String, required: true },
  author: { type: String, required: true },
  url: { type: String, required: true},
  imgsrc: { type: String, required: true}
});

var node = Mongoose.model('node', NodeSchema);

module.exports = {
  Node: node
};