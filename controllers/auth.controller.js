let mailService = require('../services/mail.service');
const User = require('../models/user.model');
const authService = require('../services/auth.service');

// Login with Email
exports.loginWithEmail = async (req, res, next) => {
    try {
        const OTPCode = Math.floor(1000 + Math.random() * 9000);
        let mailOptions = {
            toEmail: req.body.email,
            subject: 'Welcome to Happy Frames!',
            template: 'otp',
            context: {
                emailId: req.body.email,
                OTPCode: OTPCode
            }
        }
        await mailService.sendEmail(mailOptions);
        // Save the user in DB
        await User.findOneAndUpdate({
            email: req.body.email
        },
        {
            email: req.body.email,
            otpCode: OTPCode
        },
        {
            upsert: true
        });
        res.status(200).json({
            message: 'Verification code sent to email'
        })
    } catch (error) {
        next(error);
    }
};

// verify with Email
exports.verifyLoginOTP = async (req, res, next) => {
    try {
        let user = await User.findOne(req.body);
        console.log(user);
        if(user){
            await User.findByIdAndUpdate(user._id, {otpCode: ''})
            req.user = user;
            return authService.signToken(req, res);
        }
        res.status(402).json({
            message: 'Invalid OTP'
        })
    } catch (error) {
        next(error);
    }
};