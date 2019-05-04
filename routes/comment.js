//* Get all comments
//* Add a comment
//* UpCount a comment
var express = require('express');

var userController = require('../controller/user');
var commentController = require('../controller/comment');

var router = express.Router();

router
  .post(
    '/:topic_id/comment',
    userController.isLoggedIn,
    commentController.addCommentByTopicId
  )
  .post(
    '/topic/:topic_id/comment/:comment_id/upcount',
    userController.isLoggedInAjax,
    commentController.upCountByCommentId
  );

module.exports = router;
