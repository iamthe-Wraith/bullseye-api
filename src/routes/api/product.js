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
  .get((req, res, next) => Response.error(error, res))
  .patch((req, res, next) => Response.error(error, res))
  .delete((req, res, next) => Response.error(error, res));

router.route('/:productId')
  .get(ProductControllers.get)
  .patch(ProductControllers.update)
  .delete(ProductControllers.delete);

module.exports = router;
