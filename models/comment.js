var mongoose = require('mongoose');
var User = require('./user');

var UserSchema = User.schema;

mongoose.connect('mongodb://localhost/mutohut');

var Schema = mongoose.Schema;

var commentSchema = new Schema({
  //* 0: comment --> topic
  //* 1: comment --> comment
  type: {
    type: Number,
    enum: [0, 1],
    default: 0
  },
  content: {
    type: String,
    required: true
  },
  //* comment user
  publisher: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  upCount: {
    type: Number,
    default: 0
  },
  createdTime: {
    type: Date,
    default: Date.now()
  },
  hidden: {
    type: Boolean,
    default: false
  }
});

//* case: comment --> comment
commentSchema.set('ReplyToComment', {
  type: Schema.Types.ObjectId,
  ref: 'Comment',
  default: null
});

module.exports = mongoose.model('Comment', commentSchema);
