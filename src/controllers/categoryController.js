const { StatusCodes } = require('http-status-codes');
const { ProductCategory } = require('./../models/productCategory');
const sendResponse = require('../utils/response');

const getCategories = async (req, res) => {
  const categoryList = await ProductCategory.find({});
  sendResponse(res, { categories: categoryList }, StatusCodes.OK);
};

const getCategory = async (req, res) => {
  const category = await ProductCategory.findById(req.params.id);
  sendResponse(res, { category }, StatusCodes.OK);
};

const deleteCategory = async (req, res) => {
  const deletedCategory = await ProductCategory.findByIdAndUpdate(
    req.params.id,
    {
      deleted: true,
    }
  );
  sendResponse(res, { category: deletedCategory }, StatusCodes.ACCEPTED);
};

const createCategory = async (req, res) => {
  const { name, description } = req.body;
  const newCategory = await ProductCategory.create({ name, description });
  sendResponse(res, { category: newCategory }, StatusCodes.CREATED);
};

module.exports = {
  getCategories,
  getCategory,
  deleteCategory,
  createCategory,
};
