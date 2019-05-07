module.exports = {
  isLoggedIn: isLoggedIn,
  isLoggedInAjax: isLoggedInAjax,
  loginAu: loginAu,
  logout: logout,
  register: register,
  renderPersonalPage: renderPersonalPage,
  renderProfilePage: renderProfilePage,
  updateProfile: updateProfile,
  uploadAvatar: uploadAvatar
};

var md5 = require('blueimp-md5');
var passport = require('passport');
var sDateTime = require('silly-datetime');
var UserModel = require('../models/user');
var TopicController = require('./topic');

function isLoggedInAjax(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(200).json({
    err_code: 403,
    message: 'Please log in.'
  });
}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

function loginAu(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(200).json({
        err_code: 1,
        message: 'Incorrect email address or passowrd.'
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.status(200).json({
        err_code: 0,
        message: 'Ok.'
      });
    });
  })(req, res, next);
}

function logout(req, res) {
  req.logout();
  res.redirect('/');
}

async function register(req, res, next) {
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
    let currentUser = await new UserModel(user).save();

    req.logIn(currentUser, function(err) {
      if (err) {
        return next(err);
      }
      return res.status(200).json({
        err_code: 0,
        message: 'Ok.'
      });
    });
  } catch (err) {
    return res.status(500).json({
      err_code: 500,
      message: 'Internet Error.'
    });
  }
}

async function renderPersonalPage(req, res) {
  let user = await UserModel.findById(req.params.user_id);
  if (!user) {
    res.render('./settings/404.html');
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
    creTopics: creTopicsObj.length ? creTopicsObj : null,
    parTopics: parTopicsObj.length ? parTopicsObj : null,
    currentUser: req.user
  });
}

function renderProfilePage(req, res) {
  res.render('./settings/profile.html', {
    currentUser: req.user
  });
}

async function updateProfile(req, res) {
  try {
    let userUpdateInfo = req.body;
    let updateObj = {
      username: userUpdateInfo.username,
      gender: userUpdateInfo.gender,
      bio: userUpdateInfo.bio,
      location: userUpdateInfo.location
    };

    await UserModel.findByIdAndUpdate(req.user.id, updateObj);

    return res.status(200).json({
      err_code: 0,
      message: 'Ok.'
    });
  } catch (err) {
    return res.status(500).json({
      err_code: 500,
      message: 'Internet Error.'
    });
  }
}

async function uploadAvatar(req, res) {
  try {
    let filePath = '/'.concat(req.file.path);
    await UserModel.findByIdAndUpdate(req.user.id, {
      avatar: filePath
    });

    return res.status(200).json({
      err_code: 0,
      message: 'Upload successfully.',
      filePath: filePath
    });
  } catch (err) {
    return res.status(500).json({
      err_code: 500,
      message: 'Internet Error.'
    });
  }
}
