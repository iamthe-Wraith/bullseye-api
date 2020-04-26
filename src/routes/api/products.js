const { Router } = require('express');

const ProductsControllers = require('../../controllers/products');

const router = Router();

router.get('/', ProductsControllers.get);

module.exports = router;
