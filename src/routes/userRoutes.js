const express = require('express');
const { createAsyncRouter } = require('../common/asyncRouter');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const {
  jwt: { protected },
} = require('./../utils/jwt');

const router = express.Router();
const userRouter = createAsyncRouter(router);

userRouter
  .route('/')
  .get(
    protected,
    authController.grantAccess('readAny', 'users'),
    userController.getUsers
  )
  .post(protected, userController.createUser);

userRouter
  .route('/:id')
  .get(
    protected,
    authController.grantAccess('readAny', 'users'),
    userController.getUser
  )
  .delete(
    protected,
    authController.grantAccess('deleteAny', 'users'),
    userController.deleteUser
  );

module.exports = userRouter;
