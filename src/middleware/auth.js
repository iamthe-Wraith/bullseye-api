const Response = require('../utils/response');
const {
  ERROR,
  AUTHORIZATION_HEADER,
  SERVICES,
  SERVICE_NAME_HEADER
} = require('../constants');

const authMiddleware = async (req, res, next) => {
  const service = req.get(SERVICE_NAME_HEADER);

  if (typeof service === 'undefined' || !isValidService(service)) {
    const error = new Error('invalid service');
    error.data = ERROR.SERVICE;
    Response.error(error, res);
  } else {
    next();
  }
};

const isValidService = service => (SERVICES.has(service));

module.exports = authMiddleware;
