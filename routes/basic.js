//* profile update, index
const express = require('express');
const userController = require('../controller/user');
const topicController = require('../controller/topic');
const multer = require('../public/js/multerConf');

const router = express.Router();

router
  .get('/', topicController.getAllTopics)
  .get(
    '/settings/profile',
    userController.isLoggedIn,
    userController.renderProfilePage
  )
  .post(
    '/settings/profile',
    userController.isLoggedInAjax,
    userController.updateProfile
  )
  .post(
    '/profile/avatar',
    userController.isLoggedInAjax,
    multer.single('avatar'),
    userController.uploadAvatar
  );

module.exports = router;
