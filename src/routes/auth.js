const { Router } = require('express');

const authenticate = require('../controllers/auth');
const Response = require('../utils/response');
const { ERROR } = require('../constants');

const router = Router();

const error = new Error('route not found');
error.data = ERROR.NOT_FOUND;

router.route('/')
  .post(authenticate)
  .get((req, res, next) => Response.error(error, res))
  .put((req, res, next) => Response.error(error, res))
  .delete((req, res, next) => Response.error(error, res));

module.exports = router;
