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
    return Product.get({ productId })
      .then(products => products[0].remove())
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

  static get (q) {
    const query = {};

    if (q.productId) {
      query._id = q.productId;
    } else if (q.query) {
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

    return ProductSchema.find(query)
      .then(products => {
        if (products.length) {
          return products;
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
      .then(products => {
        if (Object.keys(updatable).length === 0) {
          const error = new Error('no updatable data found');
          error.data = ERROR.NOT_FOUND;
          throw error;
        } else {
          products[0].set(updatable);
          return products[0].save();
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
