var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/mutohut', { useNewUrlParser: true });

var Schema = mongoose.Schema;

var commentSchema = new Schema(
  {
    //* 0: comment --> topic
    //* 1: comment --> comment
    type: {
      type: Number,
      enum: [0, 1],
      default: 0
    },
    replyToComment: {
      type: Schema.Types.ObjectId,
      ref: 'Comment'
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
    upCountUser: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
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
  },
  {
    timestamps: { createdAt: 'createdTime', updatedAt: 'lastModifiedTime' }
  }
);

module.exports = mongoose.model('Comment', commentSchema);
