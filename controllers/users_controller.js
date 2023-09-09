const User = require('../models/user');
const ResetPasswordToken = require('../models/reset_password_token');
const resetPasswordMailer = require('../mailers/reset_password_mailer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');


module.exports.signUp = function(req, res){
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }

    return res.render('user_signup', {
        title: "Sign Up"
    });
}


module.exports.signIn = function(req, res){
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    
    return res.render('user_signin', {
        title: "Sign In"
    });
}


//Get the sign up data
module.exports.create = async function(req, res){
    //if password and confirm password are not same then redirect back
    if(req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }

    try{
        //if password and confirm password are same then check if user already exists
        let user = await User.findOne({email: req.body.email});
    
        //if user does not exist then create user
        if(!user){
            await User.create(req.body);
            return res.redirect('/users/sign-in');
        }
        else{
            res.redirect('back');
        }
    }
    catch(err){
        console.log('Error something went wrong', err);
    };
}

//Get the sign in data
module.exports.createSession = function(req, res){
    return res.redirect('/');
}

module.exports.destroySession = function(req, res){
    req.logout(function(err) {
        if(err) { console.log('Error in destroying session'); return; }
    });
    
    return res.redirect('/');
}


//Reset Password

//when user clicks on forgot pw a page opens
module.exports.forgotPassword = function(req, res){
    return res.render('forgot_password', {
        title: "Forgot Password"
    });
}

//user writes his email and email with resetlink is sent to his email
module.exports.forgotPasswordPost = async function(req, res){
    let email = req.body.email;

    let user = await User.findOne({email: email});
    if(user){
        let token = await ResetPasswordToken.create({
            user: user.id,
            accessToken: crypto.randomBytes(20).toString('hex'),
            isValid: true
        });

        token = await token.populate('user', 'name email');
        resetPasswordMailer.newResetPassword(token);
        return res.redirect('/users/sign-in');
    }
    else{
        console.log('User not found');
        return res.redirect('back');
    }
}

//when user clicks on reset password link in his email a new page opens
module.exports.resetPassword = function(req, res){
    return res.render('reset_password', {
        title: "Reset Password",
        token: req.query.token
    });
}

//user enters new password and confirm password and clicks on submit
module.exports.resetPasswordPost = async function(req, res){
    let password = req.body.password;
    let confirmPassword = req.body.confirm_password;

    if(password != confirmPassword){
        console.log('Password and confirm password do not match');
        return res.redirect('back');
    }
    
    try {
        let token = await ResetPasswordToken.findOne({accessToken: req.query.token});
        if(token && token.isValid){
            let user = await User.findById(token.user);
            user.password = password;
            user.save();
            await token.deleteOne();

            return res.redirect('/users/sign-in');
        }
        else{
            console.log('Token not found');
            return res.redirect('/users/forgot-password');
        }
    } 
    catch(err){
        console.log('Error in reset password', err);
        return res.redirect('back');
    }
}

