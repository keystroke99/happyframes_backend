const express = require('express');
const app = express();
require('./models/user.model');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const authService = require('./services/auth.service');
const passportSetup = require('./config/passport-setup');
require('dotenv').config();
const User = mongoose.model('User');
const _ = require('lodash');
const authRoutes = require('./routes/auth.routes');

const mongodbUri = process.env.MONGO_URI;
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.connect(mongodbUri, { useUnifiedTopology: true, useNewUrlParser: true }, (error) => {
  if (error) console.log(error);
});

app.use(function (req, res, next) {
  let allowedOrigins = ['*']; // list of url-s
  let origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Expose-Headers', 'Content-Disposition');
  next();
});
app.use(passport.initialize());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static(__dirname + '/'));

// ############# GOOGLE AUTHENTICATION ################
// this will call passport-setup.js authentication in the config directory

app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>');
});

app.use('/auth', authRoutes)

// route to check token with postman.
// using middleware to check for authorization header
app.get('/verify', authService.checkTokenMW, (req, res) => {
  authService.verifyToken(req, res);
  if (null === req.authData) {
    res.sendStatus(403);
  } else {
    res.json(req.authData);
  }
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Express app listening on port 3000!');
});
