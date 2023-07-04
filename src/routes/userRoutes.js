const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const {
  jwt: { protected },
} = require('./../utils/jwt');

const userRouter = express.Router();

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
  .get(userController.getUser)
  .delete(protected, userController.deleteUser);

module.exports = userRouter;
