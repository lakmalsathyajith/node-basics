const express = require('express');
const { createAsyncRouter } = require('../common/asyncRouter');
const categoryController = require('./../controllers/categoryController');
const authController = require('./../controllers/authController');
const {
  jwt: { protected },
} = require('./../utils/jwt');

const router = express.Router();
const categoryRouter = createAsyncRouter(router);

categoryRouter
  .route('/')
  .get(
    protected,
    authController.grantAccess('readAny', 'categories'),
    categoryController.getCategories
  )
  .post(
    protected,
    authController.grantAccess('createAny', 'categories'),
    categoryController.createCategory
  );

categoryRouter
  .route('/:id')
  .get(
    protected,
    authController.grantAccess('readAny', 'categories'),
    categoryController.getCategory
  )
  .delete(
    protected,
    authController.grantAccess('deleteAny', 'categories'),
    categoryController.deleteCategory
  );

module.exports = categoryRouter;
