const express = require('express');
const authController = require('./../controllers/authController');
const authRouter = require('../common/asyncRouter');

authRouter.route('/login').post(authController.login);
authRouter.route('/signup').post(authController.signUp);

module.exports = authRouter;
