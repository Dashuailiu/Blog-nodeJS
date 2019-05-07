//* Get all comments
//* Add a comment
//* UpCount a comment
var express = require('express');

var UserController = require('../controller/user');
var CommentController = require('../controller/comment');

var router = express.Router();

router
  .post(
    '/:topic_id/comment',
    UserController.isLoggedIn,
    CommentController.addCommentByTopicId
  )
  .post(
    '/topic/:topic_id/comment/:comment_id/upcount',
    UserController.isLoggedInAjax,
    CommentController.upCountByCommentId
  )
  .post(
    '/comment/:comment_id/reply',
    UserController.isLoggedIn,
    CommentController.replyComment
  );

module.exports = router;
