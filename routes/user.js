//* Registration, login, logout
var express = require('express');
var userController = require('../controller/user');
var topicController = require('../controller/topic');

var router = express.Router();

router
  .get('/', async function(req, res) {
    let topics = await topicController.getAllTopics(req, res);
    console.log(topics);
    res.render('index.html', {
      user: req.session.user,
      topics: topics
    });
  })
  .get('/login', function(req, res) {
    res.render('login.html');
  })
  .post('/login', userController.login)
  .get('/register', function(req, res) {
    res.render('register.html');
  })
  .post('/register', userController.register)
  .get('/logout', userController.logout);

//#region
// .post('/register', function(req, res) {
//   var user = req.body;
//   user.password = md5(md5(user.password));
//   //TODO register action
//   User.findOne(
//     {
//       $or: [{ email: user.email }, { username: user.username }]
//     },
//     function(err, data) {
//       if (err) {
//         return res.status(500).json({
//           err_code: 500,
//           msg: 'Server Error.'
//         });
//       }
//       if (data) {
//         //* email or username is already taken
//         return res.status(200).json({
//           err_code: 1,
//           msg: 'Email or username is already taken'
//         });
//         // .send(
//         //   JSON.stringify({ msg: 'email or username is already taken' })
//         // );
//       }

//       //* save data in database
//       new User(user).save(function(err, user) {
//         if (err) {
//           return res.status(500).json({
//             err_code: 500,
//             msg: 'Server Error.'
//           });
//         }
//       });
//       return res.status(200).json({
//         err_code: 0,
//         message: 'ok'
//       });
//     }
//   );
// });
//#endregion

module.exports = router;
