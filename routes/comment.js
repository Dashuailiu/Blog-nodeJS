//* Get all comments
//* Add a comment
//* UpCount a comment
var express = require('express');
var commentController = require('../controller/comment');

var router = express.Router();

router
  .post('/:topic_id/comment', commentController.addCommentByTopicId)
  .post('/comment/:comment_id/upcount', commentController.upCountByCommentId);

module.exports = router;
