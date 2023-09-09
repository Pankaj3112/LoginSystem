const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');


passport.use(new googleStrategy(
    {
        //to do
        clientID: "308721804967-uq8pc246k5ldglp6ad77mre6fjbi3v28.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://localhost:8000/users/auth/google/callback"
    },

    async function (accessToken, refreshToken, profile, done) {
        try{
            //find user
            let user = await User.findOne({ email: profile.emails[0].value });

            if(user){
                //if user found set this user as req.user
                return done(null,user);
            }
            else{
                //if user not found create user and set it as req.user
                user = await User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                });
                return done(null,user);
            }
        }
        catch(err){
            console.log("Error in google strategy passport",err);
            return;
        }
    }
));


module.exports = passport;