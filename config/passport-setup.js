const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const FacebookStrategy = require('passport-facebook').Strategy;
let mongoose = require('mongoose');
const User = mongoose.model('User');

require('dotenv').config();

passport.use(
  new GoogleStrategy(
    {
      // options for strategy
      callbackURL: 'http://localhost:3000/api/login/google/callback',
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET
    },
    async (accessToken, refreshToken, profile, done) => {
      const email = profile.emails[0].value;
      console.log(profile)
      // check if user already exists
      const currentUser = await User.findOne({ googleId: profile.id });
      if (currentUser) {
        // already have the user -> return (login)
        return done(null, currentUser);
      } else {
        // register user and return
        const newUser = await new User({ email: email, googleId: profile.id }).save();
        return done(null, newUser);
      }
    }
  )
);

passport.use(new FacebookStrategy({
  callbackURL: 'http://localhost:3000/api/login/facebook/callback',
  clientID: process.env.FB_CLIENT_ID,
  clientSecret: process.env.FB_SECRENT,
  profileFields: ['id', 'displayName', 'photos', 'email']
},
  async function (accessToken, refreshToken, profile, cb) {
    console.log(profile)
    // check if user already exists
    const currentUser = await User.findOne({ facebookId: profile.id });
    if (currentUser) {
      // already have the user -> return (login)
      return done(null, currentUser);
    } else {
      // register user and return
      const newUser = await new User({ facebookId: profile.id }).save();
      return done(null, newUser);
    }
  }
));
