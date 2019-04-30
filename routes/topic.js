//* Registration, login, logout
var express = require('express');
var topicController = require('../controller/topic');

var router = express.Router();

router
  .get('/topics/new', function(req, res) {
    res.render('./topic/new.html', {
      user: req.session.user
    });
  })
  .post('/topics/new', topicController.postTopic);

module.exports = router;
