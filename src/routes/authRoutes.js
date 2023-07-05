const express = require('express');
const authController = require('./../controllers/authController');
const { createAsyncRouter } = require('../common/asyncRouter');

const router = express.Router();
const authRouter = createAsyncRouter(router);

authRouter.route('/login').post(authController.login);
authRouter.route('/signup').post(authController.signUp);

module.exports = authRouter;
