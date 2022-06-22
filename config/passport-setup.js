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
      callbackURL: `${process.env.APP_DOMAIN}/api/login/google/callback`,
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
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
  callbackURL: `${process.env.APP_DOMAIN}/api/login/facebook/callback`,
  clientID: process.env.FB_CLIENT_ID,
  clientSecret: process.env.FB_SECRENT,
  profileFields: ['id', 'displayName', 'name', 'email', 'picture'],
},
  async function (accessToken, refreshToken, profile, done) {
    console.log(profile)
    let email = '';
    if('emails' in profile === true){
      if(profile.emails.legnth > 0){
        email = profile.emails[0].value;
      }
    }
    console.log('==== email ==== ', email)
    // check if user already exists
    const currentUser = await User.findOne({ facebookId: profile.id });
    console.log('==== current user === ', currentUser)
    if (currentUser) {
      // already have the user -> return (login)
      return done(null, currentUser);
    } else {
      // register user and return
      let userObj = { facebookId: profile.id };
      let isFbEmailRegistered = false;
      if(email){
        userObj.email = email
        userObj.isFbEmailRegistered = true;
      }
      userObj.isFbEmailRegistered = isFbEmailRegistered;
      const newUser = await new User(userObj).save();
      console.log('==== new user === ', newUser)
      return done(null, newUser);
    }
  }
));
