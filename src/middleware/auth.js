const path = require('path');

const Token = require('../utils/token');
const User = require('../models/user');
const Response = require('../utils/response');
const {
  AUTHORIZATION_HEADER,
  ERROR
} = require('../constants');

const authMiddleware = async (req, res, next) => {
  const token = req.get(AUTHORIZATION_HEADER);

  if (typeof token === 'undefined') {
    const error = new Error('invalid token');
    error.data = ERROR.AUTHENTICATION;
    Response.error(error, req, res);
  } else {
    try {
      const payload = await Token.verify(token);
      req.tokenPayload = payload;

      next();
    } catch (err) {
      let error = null;
      if (err.message === 'invalid signature') {
        error = new Error('you are not authorized to make this request');
        error.data = ERROR.UNAUTHORIZED;
      } else {
        error = new Error(err.message);
        error.data = ERROR.TOKEN;
      }
      
      Response.error(error, req, res);
    }
  }
};

module.exports = authMiddleware;
