var md5 = require('blueimp-md5');
var UserModel = require('../models/user');

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
  }
};
