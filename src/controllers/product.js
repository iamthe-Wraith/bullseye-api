const Product = require('../models/product');
const User = require('../models/user');
const Response = require('../utils/response');
const { ERROR, PERMISSIONS } = require('../constants');

class ProductControllers {
  static async create (req, res) {
    const { tokenPayload } = req;
    const { name, category, price } = req.body;

    if (name && category && price) {
      try {
        const requestor = await User.getRequestor(tokenPayload);

        if (requestor.permissions <= PERMISSIONS.ADMIN.lvl) {
          const product = await Product.create(name, category, price);
          Response.send({ product: Product.getSharable(product) }, req, res);
        } else {
          const error = new Error('you are not authorized to make this request');
          error.data = ERROR.UNAUTHORIZED;
          Response.error(error, req, res);
        }
      } catch (err) {
        Response.error(err, req, res);
      }
    } else {
      const error = new Error(`no ${!name ? 'name' : !category ? 'category' : 'price'} found`);
      error.data = ERROR.UNPROCESSABLE;
      Response.error(error, req, res);
    }
  }

  static async delete (req, res) {
    const { tokenPayload } = req;
    const { productId } = req.params;

    if (productId) {
      try {
        const requestor = await User.getRequestor(tokenPayload);

        if (requestor.permissions <= PERMISSIONS.ADMIN.lvl) {
          await Product.delete(productId);
          Response.send({}, req, res);
        } else {
          const error = new Error('you are not authorized to make this request');
          error.data = ERROR.UNAUTHORIZED;
          Response.error(error, req, res);
        }
      } catch (err) {
        Response.error(err, req, res);
      }
    } else {
      const error = new Error('no productId found');
      error.data = ERROR.UNPROCESSABLE;
      Response.error(error, req, res);
    }
  }

  static get (req, res) {
    const { productId = null } = req.params;
    const query = { query: req.query };

    if (productId) query.productId = productId;

    Product.get(query)
      .then(response => {
        if (productId) {
          Response.send({ product: Product.getSharable(response.products[0]) }, req, res)
        } else {
          Response.send({
            products: response.products.map(product => Product.getSharable(product)),
            count: response.count
          }, req, res);
        }
      })
      .catch(err => Response.error(err, req, res));
  }

  static async update (req, res) {
    const { tokenPayload } = req;
    const { productId } = req.params;

    if (productId) {
      try {
        const requestor = await User.getRequestor(tokenPayload);

        if (requestor.permssions <= PERMISSIONS.ADMIN.lvl) {
          const product = Product.update(productId, req.body)
          Response.send({ product: Product.getSharable(product) }, req, res);
        } else {
          const error = new Error('you are not authorized to make this request');
          error.data = ERROR.UNAUTHORIZED;
          Response.error(error, req, res);
        }
      } catch (err) {
        Response.error(err, req, res);
      }
    } else {
      const error = new Error('no productId found');
      error.data = ERROR.UNPROCESSABLE;
      Response.error(error, req, res);
    }
  }
}

module.exports = ProductControllers;
