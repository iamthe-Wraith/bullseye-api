const ProductSchema = require('../schemas/product');
const {
  DEFAULT_PRODUCTS_TO_RETURN,
  ERROR,
  MAX_PRODUCTS_TO_RETURN
} = require('../constants');
const { getPaginationPage } = require('../utils/helpers');

class Product {
  static create (name, category, price, image) {
    const product = new ProductSchema({ name, category, price, image });

    return product.save()
      .then(product => product)
      .catch(err => {
        let error = null;

        if (err.data) {
          error = err;
        } else if (err.errors) {
          error = new Error(err.errors[Object.keys(err.errors)[0]]);
          error.data = ERROR.GEN;
        } else {
          error = new Error(err.message);
          error.data = ERROR.GEN;
        }
        
        throw error;
      });
  }

  static delete (productId) {
    return Product.get({ productId })
      .then(results => results.products[0].remove())
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
      image: product.image,
      id: product._id
    }
  }

  static get (q) {
    const query = {};
    let page = 1;
    let skipLimit = DEFAULT_PRODUCTS_TO_RETURN;

    if (q.productId) query._id = q.productId;

    if (q.query) {
      if (q.query.page) page = getPaginationPage(q.query.page);
      if (q.query.numProducts) {
        const numProducts = parseInt(q.query.numProducts);

        if (!isNaN(numProducts)) {
          skipLimit = numProducts < MAX_PRODUCTS_TO_RETURN ? numProducts : MAX_PRODUCTS_TO_RETURN;
        }
      }

      if (q.query.name) query.name = { $regex: q.query.name };
      if (q.query.category) query.category = { $regex: q.query.category };

      if (q.query.minPrice || q.query.maxPrice) {
        query.price = {};

        if (q.query.minPrice) {
          const minPrice = parseFloat(q.query.minPrice);

          if (!isNaN(minPrice)) query.price.$gte = minPrice;
        }

        if (q.query.maxPrice) {
          const maxPrice = parseFloat(q.query.maxPrice);

          if (!isNaN(maxPrice)) query.price.$lte = maxPrice;
        }
      } else if (q.query.price) {
        const price = parseFloat(q.query.price);

        if (!isNaN(price)) query.price = price;
      }
    }

    let skipCount = (page - 1) * skipLimit;
    let results = {};

    return ProductSchema.find(query)
      .skip(skipCount)
      .limit(skipLimit)
      .sort({ name: 'ascending' })
      .then(products => {
        if (products.length) {
          results.products = products;
        } else {
          let error = null;

          if (q.productId) {
            error = new Error(`product with ID ${q.productId} not found`);
          } else if (q.query) {
            error = new Error('no products matching the provided query were found');
          } else {
            error = new Error('no products found');
          }

          error.data = ERROR.NOT_FOUND;
          throw error;
        }
      })
      .then(() => new Promise((resolve, reject) => {
        if (query._id) {
          resolve(results);
        } else {
          ProductSchema.countDocuments(query, (err, count) => {
            if (err) {
              const error = new Error(err.message);
              error.data = ERROR.GEN;
              reject(error);
            } else {
              results.count = count;
              resolve(results);
            }
          });
        }
      }))
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

    return Product.get({ productId })
      .then(results => {
        if (Object.keys(updatable).length === 0) {
          const error = new Error('no updatable data found');
          error.data = ERROR.NOT_FOUND;
          throw error;
        } else {
          results.products[0].set(updatable);
          return results.products[0].save();
        }
      })
      .then(() => Product.get({ productId }))
      .then(results => {
        if (results.products.length) {
          return results.products[0];
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
