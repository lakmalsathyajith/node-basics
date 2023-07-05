const { StatusCodes } = require('http-status-codes');
const { ProductCategory } = require('./../models/productCategory');

const getCategories = async (req, res) => {
  const categoryList = await ProductCategory.find({});
  res.status(StatusCodes.OK).json(categoryList);
};

const getCategory = async (req, res) => {
  const category = await ProductCategory.findById(req.params.id);
  res.status(StatusCodes.OK).json(category);
};

const deleteCategory = async (req, res) => {
  const deletedCategory = await ProductCategory.findByIdAndUpdate(
    req.params.id,
    {
      deleted: true,
    }
  );
  res.status(StatusCodes.ACCEPTED).json(deletedCategory);
};

const createCategory = async (req, res) => {
  const { name, description } = req.body;
  const newCategory = await ProductCategory.create({ name, description });
  res.status(StatusCodes.CREATED).json(newCategory);
};

module.exports = {
  getCategories,
  getCategory,
  deleteCategory,
  createCategory,
};
