const ProductSchema = require('../schemas/product');
const { ERROR } = require('../constants');

class Product {
  static create (name, category, price) {
    const product = new ProductSchema({ name, category, price });

    return product.save()
      .then(product => {
        console.log(product);
        
        return product;
      });
  }

  static delete (productId) {
    return Product.get(productId)
      .then(product => product.remove())
      .then(() => ProductSchema.findOne({ _id: productId }))
      .then(product => {
        if (product === null) {
          return true;
        } else {
          const error = new Error(`failed to delete product with ID ${productId}`);
          error.data = ERROR.GEN;
          throw error;
        }
      })
      .catch(err => {
        let error = null;

        if (err.data) {
          error = err;
        } else if (err.errors) {
          error = new Error(err.errors[Object.keys(err.errors)[0]]);
          error.data = ERROR.INVALID_ARG;
        } else {
          error = new Error(err.message);
          error.data = ERROR.GEN;
        }
        
        throw error;
      });
  }

  static getSharable (product) {
    return {
      name: product.name,
      category: product.category,
      price: product.price,
      id: product._id
    }
  }

  static get (productId) {
    return ProductSchema.find({ _id: productId })
      .then(products => {
        if (products.length) {
          return products[0];
        } else {
          const error = new Error(`product with ID ${productId} not found`);
          error.data = ERROR.NOT_FOUND;
          throw error;
        }
      })
      .catch(err => {
        let error = null;

        if (err.name === 'CastError') {
          error = new Error('invalid productId');
          error.data = ERROR.INVALID_ARG;
        } else if (err.data) {
          error = err;
        } else {
          error = new Error(err.message);
          error.data = ERROR.GEN;
        }

        throw error;
      })
  }

  static update (productId, data) {
    const updatable = {};

    if (data.name) updatable.name = data.name;
    if (data.category) updatable.category = data.category;
    if (data.price) updatable.price = data.price;

    return Product.get(productId)
      .then(product => {
        if (Object.keys(updatable).length === 0) {
          const error = new Error('no updatable data found');
          error.data = ERROR.NOT_FOUND;
          throw error;
        } else {
          product.set(updatable);
          return product.save();
        }
      })
      .then(() => ProductSchema.findOne({ _id: productId }))
      .then(product => {
        if (product) {
          return product;
        } else {
          const error = new Error(`failed to find product after update`);
          error.data = ERROR.NOT_FOUND;
          throw error;
        }
      })
      .catch(err => {
        let error = null;

        if (err.name === 'CastError') {
          error = new Error('invalid productId');
          error.data = ERROR.INVALID_ARG;
        } else if (err.errors) {
          error = new Error(err.errors[Object.keys(err.errors)[0]]);
          error.data = ERROR.INVALID_ARG;
        } else if (err.data) {
          error = err;
        } else {
          error = new Error(err.message);
          error.data = ERROR.GEN;
        }

        throw error;
      });
  }
}

module.exports = Product;
