var md5 = require('blueimp-md5');
var sDateTime = require('silly-datetime');
var UserModel = require('../models/user');
var TopicController = require('./topic');

module.exports = {
  login: async function(req, res) {
    //TODO login action
    var loginUser = req.body;
    try {
      let user = await UserModel.findOne({
        email: loginUser.email,
        password: md5(md5(loginUser.password))
      });
      if (!user) {
        return res.status(200).json({
          err_code: 1,
          message: 'Incorrect email address or passowrd.'
        });
      }
      req.session.user = user;

      res.status(200).json({
        err_code: 0,
        message: 'Ok.'
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        err_code: 500,
        message: 'Internet Error.'
      });
    }
  },
  logout: function(req, res) {
    req.session.user = null;
    res.redirect('/login');
  },
  register: async function(req, res) {
    var user = req.body;
    try {
      if (await UserModel.findOne({ email: user.email })) {
        return res.status(200).json({
          err_code: 1,
          message: 'Email is already taken.'
        });
      }

      if (await UserModel.findOne({ username: user.username })) {
        return res.status(200).json({
          err_code: 2,
          message: 'Username is already taken.'
        });
      }

      user.password = md5(md5(user.password));
      await new UserModel(user).save();

      req.session.user = user;

      res.status(200).json({
        err_code: 0,
        message: 'Ok.'
      });
    } catch (err) {
      return res.status(500).json({
        err_code: 500,
        message: 'Internet Error.'
      });
    }
  },
  renderPersonalPage: async function(req, res) {
    let user = await UserModel.findById(req.params.user_id);
    if (!user) {
      res.render('404.html');
    }

    let userObj = {
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      bio: user.bio,
      createdTime: sDateTime.fromNow(user.createdTime)
    };

    let creTopics = await TopicController.getAllCreatedTopicsByUserId(user.id);
    let parTopics = await TopicController.getAllParticipatedTopicsByUserId(
      user.id
    );

    let creTopicsObj = TopicController.serializeTopicList(creTopics);
    let parTopicsObj = TopicController.serializeTopicList(parTopics);

    res.render('./user/personal_page.html', {
      user: userObj,
      creTopics: creTopicsObj,
      parTopics: parTopicsObj,
      currentUser: req.session.user
    });
  }
};
