const { Router } = require('express');

const ProductControllers = require('../../controllers/product');
const Response = require('../../utils/response');
const { ERROR } = require('../../constants');

const router = Router();

const error = new Error('invalid url. this path requires a :productId (/api/product/123456)');
error.data = ERROR.NOT_ALLOWED;

router.param('productId', (req, res, next) => next());

router.route('/')
  .post(ProductControllers.create)
  .get(ProductControllers.get)
  .put((req, res, next) => Response.error(error, res))
  .delete((req, res, next) => Response.error(error, res));

router.route('/:productId')
  .post((req, res, next) => Response.error(error, res))
  .get(ProductControllers.get)
  .put(ProductControllers.update)
  .delete(ProductControllers.delete);

module.exports = router;
