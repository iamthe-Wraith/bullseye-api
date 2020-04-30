const { Router } = require('express');

const UserControllers = require('../../controllers/user');
const authMiddleware = require('../../middleware/auth');

const router = Router();

router.param('username', (req, res, next) => next());

router.route('/')
  .post(authMiddleware, UserControllers.create)
  .get(authMiddleware, UserControllers.get);

router.route('/:username')
  .get(authMiddleware, UserControllers.get)
  .patch(authMiddleware, UserControllers.update)
  .delete(authMiddleware, UserControllers.delete);

module.exports = router;
