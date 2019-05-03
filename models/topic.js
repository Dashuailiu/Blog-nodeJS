var mongoose = require('mongoose');
var User = require('./user');
var Comment = require('./comment');

var UserSchema = User.schema;
var CommentSchema = Comment.schema;
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
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastUser: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ],
  commentUsers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  upUsers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  viewCount: {
    type: Number,
    default: 0
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
