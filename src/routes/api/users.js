const { Router } = require('express');

const UserControllers = require('../../controllers/user');
const authMiddleware = require('../../middleware/auth');
const Response = require('../../utils/response');
const { ERROR } = require('../../constants');

const router = Router();

const error = new Error('invalid url. this path requires a :username (/api/user/testUser)');
error.data = ERROR.NOT_ALLOWED;

router.param('username', (req, res, next) => next());

router.route('/')
  .post(authMiddleware, UserControllers.create)
  .get(authMiddleware, UserControllers.get)
  .put((req, res, next) => Response.error(error, req, res))
  .delete((req, res, next) => Response.error(error, req, res));

router.route('/:username')
  .get(authMiddleware, UserControllers.get)
  .put(authMiddleware, UserControllers.update)
  .delete(authMiddleware, UserControllers.delete);

module.exports = router;
