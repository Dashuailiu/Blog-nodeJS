//* Registration, login, logout
var express = require('express');
var userController = require('../controller/user');

var router = express.Router();

router
  .get('/login', function(req, res) {
    res.render('login.html');
  })
  .post('/login', userController.loginAu)
  // .post('/login', userController.login)
  .get('/register', function(req, res) {
    res.render('register.html');
  })
  .post('/register', userController.register)
  .get('/logout', userController.isLoggedIn, userController.logout)
  .get('/users/:user_id', userController.renderPersonalPage);

module.exports = router;
