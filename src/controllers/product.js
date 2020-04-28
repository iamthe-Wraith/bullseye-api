const Product = require('../models/product');
const Response = require('../utils/response');
const { ERROR } = require('../constants');

class ProductControllers {
  static create (req, res) {
    const { name, category, price } = req.body;

    if (name && category && price) {
      Product.create(name, category, price)
        .then(product => Response.send({ product: Product.getSharable(product) }, res))
        .catch(err => Response.error(err, res));
    } else {
      const error = new Error(`no ${!name ? 'name' : !category ? 'category' : 'price'} found`);
      error.data = ERROR.UNPROCESSABLE;
      Response.error(error, res);
    }
  }

  static delete (req, res) {
    const { productId } = req.params;

    if (productId) {
      Product.delete(productId)
        .then(() => Response.send({}, res))
        .catch(err => Response.error(err, res));
    } else {
      const error = new Error('no productId found');
      error.data = ERROR.UNPROCESSABLE;
      Response.error(error, res);
    }
  }

  static get (req, res) {
    const { productId = null } = req.params;
    const query = { query: req.query };

    if (productId) query.productId = productId;

    Product.get(query)
      .then(response => {
        if (productId) {
          Response.send({ product: Product.getSharable(response.products[0]) }, res)
        } else {
          Response.send({
            products: response.products.map(product => Product.getSharable(product)),
            count: response.count
          }, res);
        }
      })
      .catch(err => Response.error(err, res));
  }

  static update (req, res) {
    const { productId } = req.params;

    if (productId) {
      Product.update(productId, req.body)
        .then(product => Response.send({ product: Product.getSharable(product) }, res))
        .catch(err => Response.error(err, res));
    } else {
      const error = new Error('no productId found');
      error.data = ERROR.UNPROCESSABLE;
      Response.error(error, res);
    }
  }
}

module.exports = ProductControllers;
