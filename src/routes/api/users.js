const { Router } = require('express');

const UsersControllers = require('../../controllers/users');

const router = Router();

router.get('/', UsersControllers.get);

module.exports = router;
