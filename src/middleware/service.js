const Response = require('../utils/response');
const {
  ERROR,
  SERVICES,
  SERVICE_NAME_HEADER
} = require('../constants');

const serviceMiddleware = (req, res, next) => {
  const service = req.get(SERVICE_NAME_HEADER);

  if (typeof service === undefined || !SERVICES.has(service)) {
    const error = new Error('invalid service');
    error.data = ERROR.SERVICE;
    Response.error(error, req, res);
  } else {
    next();
  }
};

module.exports = serviceMiddleware;
