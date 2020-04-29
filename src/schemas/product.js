const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'product name is required']
  },
  category: {
    type: String,
    require: [true, 'product category is required']
  },
  price: {
    type: Number,
    required: [true, 'product price is required'],
    validate: {
      validator: price => typeof price === 'number' && price > 0,
      message: 'price must be a number that is greater than 0'
    }
  },
  image: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('product', ProductSchema);
