let authRoutes = require('express').Router();
let passport = require('passport');
let authService = require('../services/auth.service');
let authController = require('../controllers/auth.controller');

authRoutes.get(
  '/google',
  passport.authenticate('google', {
    session: false,
    scope: ["profile", "email"],
    accessType: "offline",
    approvalPrompt: "force"
  })
);

// callback url upon successful google authentication
authRoutes.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    authService.signToken(req, res);
  }
);

authRoutes.get(
  '/facebook',
  passport.authenticate('facebook', {
    session: false,
    accessType: "offline",
    approvalPrompt: "force",
    scope: ['email'],
    authType: 'rerequest'
  })
);

// callback url upon successful Facebook authentication
authRoutes.get(
  '/facebook/callback',
  passport.authenticate('facebook', { session: false }),
  async (req, res) => {
    if(_.isEmpty(req.user.email) === true && req.user.isFbEmailRegistered === false){
      // remove the user object from DB
      await User.deleteOne({_id: req.user.id});
      return res.status(500).json({message: 'your Facbook account is not linked with a valid email. Please allow email access and try again later'});
    }
    authService.signToken(req, res);
  }
);

authRoutes.post(
  '/email',
  authController.loginWithEmail
);

authRoutes.post(
  '/email/verify',
  authController.verifyLoginOTP
);

module.exports = authRoutes;