const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: 'string',
    required: [true, 'Name is required.'],
    unique: true,
  },
  description: {
    type: 'string',
    required: [true, 'Description is required.'],
  },
  price: {
    type: 'number',
    required: [true, 'Price is required.'],
  },
  category: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'categories',
    },
  ],
  created_at: {
    type: Date,
    default: Date.now(),
  },
  deleted: {
    type: 'boolean',
    default: false,
  },
});

const Product = mongoose.model('products', productSchema);

module.exports = Product;
