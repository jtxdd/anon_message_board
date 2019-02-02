const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const Thread = new mongoose.Schema({
  board: { type: String, required: true },
  text:  { type: String, required: true },
  created_on: { type: Date, default: Date.now },
  bumped_on:  { type: Date, default: Date.now },
  reported:   { type: Boolean },
  delete_password: { type: String, required: true },
  replies: [{
    _id: {type: ObjectId},
    text: {type: String, required: true},
    created_on: {type: Date, default: Date.now},
    delete_password: {type: String, required: true},
    reported: {type: Boolean}
  }],
  views: [{ip: String}]
});

module.exports = mongoose.model('Thread', Thread);