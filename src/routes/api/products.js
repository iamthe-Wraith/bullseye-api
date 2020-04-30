const { Router } = require('express');

const ProductControllers = require('../../controllers/product');
const authMiddleware = require('../../middleware/auth');

const router = Router();

router.param('productId', (req, res, next) => next());

router.route('/')
  .post(authMiddleware, ProductControllers.create)
  .get(ProductControllers.get)
  .patch((req, res, next) => Response.error(error, req, res))
  .delete((req, res, next) => Response.error(error, req, res));

router.route('/:productId')
  .post((req, res, next) => Response.error(error, req, res))
  .get(ProductControllers.get)
  .patch(authMiddleware, ProductControllers.update)
  .delete(authMiddleware, ProductControllers.delete);

module.exports = router;
