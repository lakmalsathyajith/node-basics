const { StatusCodes } = require('http-status-codes');
const Product = require('./../models/product');

console.log({ Product });

const getProducts = async (req, res) => {
  const categoryList = await Product.find({});
  res.status(StatusCodes.OK).json(categoryList);
};

const getProduct = async (req, res) => {
  const category = await Product.findById(req.params.id);
  res.status(StatusCodes.OK).json(category);
};

const deleteProduct = async (req, res) => {
  const deletedCategory = await Product.findByIdAndUpdate(req.params.id, {
    deleted: true,
  });
  res.status(StatusCodes.ACCEPTED).json(deletedCategory);
};

const createProduct = async (req, res) => {
  const { name, description, price, category } = req.body;
  const newProduct = await Product.create({
    name,
    description,
    price,
    category,
  });
  res.status(StatusCodes.CREATED).json(newProduct);
};

module.exports = {
  getProducts,
  getProduct,
  deleteProduct,
  createProduct,
};
