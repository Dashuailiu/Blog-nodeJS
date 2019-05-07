var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/mutohut', { useNewUrlParser: true });

var Schema = mongoose.Schema;

var userSchema = new Schema(
  {
    email: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'secret'],
      default: 'secret'
    },
    birthday: {
      type: Date
    },
    location: {
      type: String
    },
    createdTime: {
      type: Date,
      default: Date.now()
    },
    lastModifiedTime: {
      type: Date,
      default: Date.now()
    },
    avatar: {
      type: String,
      default: '/public/img/avatar-default.png'
    },
    bio: {
      type: String,
      default: '"This guy is so lazy. He didn\'t leave any signature."'
    },
    commentStatus: {
      //* Allowed to comment?
      type: Boolean,
      default: true
    },
    LoginStatus: {
      //* Allowed to log in?
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: { createdAt: 'createdTime', updatedAt: 'lastModifiedTime' }
  }
);

module.exports = mongoose.model('User', userSchema);
