const { Router } = require('express');

const {
  PRODUCT_ROUTE,
  PRODUCTS_ROUTE,
  USER_ROUTE,
  USERS_ROUTE
} = require('../../constants');
const ProductRouter = require('./product');
const ProductsRouter = require('./products');
const UserRouter = require('./user');
const UsersRouter = require('./users');

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'EXPRESS API CONNECTED TO REACT AND IS READY AND WAITING' });
});

router.use(PRODUCT_ROUTE, ProductRouter);
router.use(PRODUCTS_ROUTE, ProductsRouter);

router.use(USER_ROUTE, UserRouter);
router.use(USERS_ROUTE, UsersRouter);

module.exports = router;
