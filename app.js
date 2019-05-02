//! import the package here.
//* build-in packages
var path = require('path');

//* customised packages
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const routeSession = require('./routes/user');
const routeTopic = require('./routes/topic');
const routeComment = require('./routes/comment');
const session = require('express-session');

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

//! Route table
app.use(routeSession);
app.use(routeTopic);
app.use(routeComment);

app.listen(portNo, function() {
  console.log(`Running on port ${portNo}....`);
});
