const { Router } = require('express');

const UserControllers = require('../../controllers/user');
const Response = require('../../utils/response');
const { ERROR } = require('../../constants');

const router = Router();

const error = new Error('invalid url. this path requires a :username (/api/user/testUser)');
error.data = ERROR.NOT_ALLOWED;

router.param('username', (req, res, next) => next());

router.route('/')
  .post(UserControllers.create)
  .get(UserControllers.get)
  .put((req, res, next) => Response.error(error, res))
  .delete((req, res, next) => Response.error(error, res));

router.route('/:username')
  .get(UserControllers.get)
  .put(UserControllers.update)
  .delete(UserControllers.delete);

module.exports = router;
