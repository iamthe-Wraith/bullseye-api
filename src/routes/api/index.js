const { Router } = require('express');

const {
  PRODUCTS_ROUTE,
  USERS_ROUTE
} = require('../../constants');
const ProductsRouter = require('./products');
const UsersRouter = require('./users');
const Response = require('../../utils/response');

const router = Router();

router.get('/', (req, res) => {
  Response.send({
    message: 'EXPRESS API CONNECTED TO REACT AND IS READY AND WAITING'
  }, req, res);
});

router.use(PRODUCTS_ROUTE, ProductsRouter);
router.use(USERS_ROUTE, UsersRouter);

module.exports = router;
