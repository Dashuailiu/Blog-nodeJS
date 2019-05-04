//! import the package here.
//* build-in packages
var path = require('path');

//* customised packages
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const routeBasic = require('./routes/basic');
const routeUser = require('./routes/user');
const routeTopic = require('./routes/topic');
const routeComment = require('./routes/comment');
const session = require('express-session');
const md5 = require('blueimp-md5');
var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;

var UserModel = require('./models/user');

//! constant variables
const portNo = 4000;

//! Declare application
var app = express();
//! Setting for the rendering engine
app.engine('html', require('express-art-template'));
app.set('views', path.join(__dirname, './views/'));

//! Setting for the resources loading
app.use('/public/', express.static(path.join(__dirname, './public/')));
app.use(
  '/node_modules/',
  express.static(path.join(__dirname, './node_modules/'))
);

//! Setting for the middleware
//* setting for the 'body-parser'
//* parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//* parse application/json
app.use(bodyParser.json());

//* Override with '_method' header in the request
app.use(methodOverride('_method'));

//* express session settings
app.use(
  session({
    secret: 'lexmutohut',
    resave: false,
    saveUninitialized: true
  })
);

//* User authentication
app.use(passport.initialize());
app.use(passport.session());

//* Set Local strategy
passport.use(
  'local',
  new LocalStrategy({ usernameField: 'email' }, function(
    username,
    password,
    done
  ) {
    UserModel.findOne(
      { email: username, password: md5(md5(password)) },
      function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: 'Incorrect email or password.' });
        }
        return done(null, user);
      }
    );
  })
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  UserModel.findById(id, function(err, user) {
    done(err, user);
  });
});

//! Route table
app.use(routeBasic);
app.use(routeUser);
app.use(routeTopic);
app.use(routeComment);

app.listen(portNo, function() {
  console.log(`Running on port ${portNo}....`);
});
