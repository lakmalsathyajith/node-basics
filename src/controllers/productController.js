const { StatusCodes } = require('http-status-codes');
const Product = require('./../models/product');
const sendResponse = require('../utils/response');

const getProducts = async (req, res) => {
  const queryObj = { ...req.query };

  const productAggregation = [];
  let aggregationProjection = {};
  if (queryObj['name']) {
    const regexName = new RegExp(`.*${queryObj['name']}.*`);
    productAggregation.push({
      $match: { name: regexName },
    });
  }

  if (queryObj['seller']) {
    const lookup = {
      $lookup: {
        from: 'users',
        localField: 'seller',
        foreignField: '_id',
        as: 'seller',
      },
    };

    productAggregation.push(lookup);
    const regexSellerName = new RegExp(`.*${queryObj['seller']}.*`);
    const projection = {
      'seller._id': 0,
      'seller.password': 0,
      'seller.role': 0,
      'seller.created_at': 0,
      'seller.deleted': 0,
      'seller.__v': 0,
    };
    aggregationProjection = { ...aggregationProjection, ...projection };
    productAggregation.push({
      $match: { 'seller.name': regexSellerName },
    });
    //productAggregation.push(sellerProjections);
  }

  if (queryObj['category']) {
    const lookup = {
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'category',
      },
    };

    productAggregation.push(lookup);
    const regexCategory = new RegExp(`.*${queryObj['category']}.*`);
    const projection = {
      'category._id': 0,
      'category.created_at': 0,
      'category.deleted': 0,
      'category.__v': 0,
    };
    aggregationProjection = { ...aggregationProjection, ...projection };
    productAggregation.push({
      $match: { 'category.name': regexCategory },
    });
  }

  let productList;
  if (productAggregation.length > 0) {
    productAggregation.push({
      $project: aggregationProjection,
    });

    productList = await Product.aggregate(productAggregation);
  } else {
    productList = await Product.find({});
  }
  sendResponse(res, { products: productList }, StatusCodes.OK);
};

const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate({
      path: 'seller',
      select: { _id: 0, name: 1 },
    })
    .populate({ path: 'category', select: { _id: 0, name: 1 } });
  sendResponse(res, { product }, StatusCodes.OK);
};

const deleteProduct = async (req, res) => {
  const deletedProduct = await Product.findByIdAndUpdate(req.params.id, {
    deleted: true,
  });
  sendResponse(res, { product: deletedProduct }, StatusCodes.ACCEPTED);
};

const createProduct = async (req, res) => {
  const { name, description, price, category } = req.body;
  const newProduct = await Product.create({
    name,
    description,
    price,
    category,
    seller: req.user.id,
  });
  sendResponse(res, { product: newProduct }, StatusCodes.CREATED);
};

const updateProduct = async (req, res) => {
  const { name, description, price, category } = req.body;
  const newProduct = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      price,
      category,
    },
    { new: true }
  );
  sendResponse(res, { product: newProduct }, StatusCodes.NO_CONTENT);
};

module.exports = {
  getProducts,
  getProduct,
  deleteProduct,
  createProduct,
  updateProduct,
};
