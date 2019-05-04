//* profile update, index
var express = require('express');
var userController = require('../controller/user');
var topicController = require('../controller/topic');

var router = express.Router();

router
  .get('/', topicController.getAllTopics)
  .get('/settings/profile', userController.isLoggedIn, function(req, res) {
    res.render('./settings/profile.html', {
      currentUser: req.user
    });
  });

module.exports = router;
