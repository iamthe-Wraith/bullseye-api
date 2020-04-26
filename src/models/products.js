const ProductSchema = require('../schemas/product');
const { ERROR } = require('../constants');

class Products {
  static get (q = {}) {
    const query = {};
    if (q.name) query.name = { $regex: q.name };
    if (q.category) query.category = { $regex: q.category };

    if (q.minPrice || q.maxPrice) {
      query.price = {};

      if (q.minPrice) {
        const minPrice = parseFloat(q.minPrice);

        if (!isNaN(minPrice)) query.price.$gte = minPrice;
      }

      if (q.maxPrice) {
        const maxPrice = parseFloat(q.maxPrice);

        if (!isNaN(maxPrice)) query.price.$lte = maxPrice;
      }
    } else if (q.price) {
      const price = parseFloat(q.price);

      if (!isNaN(price)) query.price = price;
    }

    return ProductSchema.find(query)
      .then(products => {
        if (products.length) {
          return products;
        } else {
          const error = new Error(`no products found${Object.keys(query).length ? ' that match the provided query' : ''}`);
          error.data = ERROR.NOT_FOUND;
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
}

module.exports = Products;
