var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/mutohut');

var Schema = mongoose.Schema;

var topicSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  section: {
    type: Number,
    enum: [1, 2, 3, 4],
    required: true
  },
  publisher: {
    type: String,
    required: true
  },
  commentCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  lastUser: {
    type: String,
    default: ''
  },
  createdTime: {
    type: Date,
    default: Date.now()
  },
  lastModifiedTime: {
    type: Date,
    default: Date.now()
  },
  hidden: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Topic', topicSchema);
