const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersController = require('../controllers/users_controller');

router.get('/sign-up', usersController.signUp);
router.get('/sign-in', usersController.signIn);

router.post('/create', usersController.create);

router.get('/forgot-password', usersController.forgotPassword);
router.post('/forgot-password', usersController.forgotPasswordPost);

router.get('/reset-password/' , usersController.resetPassword);
router.post('/reset-password/',  usersController.resetPasswordPost);

//use passport as a middleware to authenticate
router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect: '/users/sign-in'},
), usersController.createSession);

//sign out
router.get('/sign-out', usersController.destroySession);

//google authentication
router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

//callback url
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/users/sign-in'}), usersController.createSession);

module.exports = router;