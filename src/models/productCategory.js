const mongoose = require('mongoose');

const productCategorySchema = new mongoose.Schema({
  name: {
    type: 'string',
    required: [true, 'Name is required.'],
    unique: true,
  },
  description: {
    type: 'string',
    required: [true, 'Description is required.'],
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
  deleted: {
    type: 'boolean',
    default: false,
  },
});

const Category = mongoose.model('categories', productCategorySchema);

exports.ProductCategory = Category;
