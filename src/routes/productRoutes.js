const express = require('express');
const { createAsyncRouter } = require('../common/asyncRouter');
const productController = require('./../controllers/productController');
const authController = require('./../controllers/authController');
const {
  jwt: { protected },
} = require('./../utils/jwt');

const router = express.Router();
const productRouter = createAsyncRouter(router);

productRouter
  .route('/')
  .get(
    protected,
    authController.grantAccess('readAny', 'products'),
    productController.getProducts
  )
  .post(
    protected,
    authController.grantAccess('createAny', 'products'),
    productController.createProduct
  );

productRouter
  .route('/:id')
  .get(
    protected,
    authController.grantAccess('readAny', 'products'),
    productController.getProduct
  )
  .delete(
    protected,
    authController.grantAccess('deleteAny', 'products'),
    productController.deleteProduct
  );

module.exports = productRouter;
