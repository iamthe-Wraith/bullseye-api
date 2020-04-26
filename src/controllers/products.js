const Products = require('../models/products');
const Product = require('../models/product');
const Response = require('../utils/response');

class ProductsControllers {
  static get (req, res) {
    Products.get(req.query)
      .then(products => {
        Response.send({
          products: products.map(product => Product.getSharable(product))
        }, res); 
      })
      .catch(err => {
        Response.error(err, res);
      });
  }
}

module.exports = ProductsControllers;
