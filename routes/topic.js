//* Registration, login, logout
var express = require('express');

var topicController = require('../controller/topic');
var userController = require('../controller/user');

var router = express.Router();

router
  .get('/topics/new', userController.isLoggedIn, function(req, res) {
    res.render('./topic/new.html', {
      currentUser: req.user
    });
  })
  .post('/topics/new', userController.isLoggedIn, topicController.postTopic)
  .get('/topics/nocomments', topicController.getTopicsWithoutComments)
  .get('/topics/:topic_id', topicController.getTopicById);

module.exports = router;
