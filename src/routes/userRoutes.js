const express = require('express');
const userController = require('./../controllers/userController');
const {
  jwt: { protected },
} = require('./../utils/jwt');

const userRouter = express.Router();

userRouter
  .route('/')
  .get(protected, userController.getUsers)
  .post(userController.createUser);

userRouter
  .route('/:id')
  .get(userController.getUser)
  .delete(userController.deleteUser);

module.exports = userRouter;
