const path = require('path');

module.exports = {
  /* DB */
  DEFAULT_USERS_TO_RETURN: 10,
  MAX_USERS_TO_RETURN: 100,
  DEFAULT_PRODUCTS_TO_RETURN: 20,
  MAX_PRODUCTS_TO_RETURN: 100,

  /* ENCRYPTION */
  SALT_ROUNDS: 10,

  /* ERRORS */
  ERROR: {
    AUTHENTICATION: { name: 'Authentication', code: 401 },
    CONFLICT: { name: 'Conflict', code: 409 },
    GEN: { name: 'Error', code: 400 },
    INVALID_ARG: { name: 'InvalidArgument', code: 422 },
    NOT_ALLOWED: { name: 'NotAllowed', code: 405 },
    NOT_FOUND: { name: 'NotFound', code: 404 },
    SERVICE: { name: 'ServiceError', code: 422 },
    TOKEN: { name: 'JsonWebTokenError', code: '400' },
    UNAUTHORIZED: { name: 'Unauthorized', code: 403 },
    UNPROCESSABLE: { name: 'UnprocessableEntity', code: 422 }
  },

  /* FORMATS */
  EMAIL_FORMAT: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  USERNAME_FORMAT: /^[a-zA-Z0-9]*$/,

  /* HEADERS */
  AUTHORIZATION_HEADER: 'Authorization',
  SERVICE_NAME_HEADER: 'serviceName',

  /* PERMISSIONS */
  PERMISSIONS: {
    OWNER: { label: 'owner', lvl: 0 },
    ADMIN: { label: 'admin', lvl: 1 },
    MEMBER: { label: 'member', lvl: 2 }
  },

  /* ROUTES */
  API_ROUTE: '/api',
  AUTH_ROUTE: '/auth',
  PRODUCTS_ROUTE: '/products',
  USERS_ROUTE: '/users',

  /* SERVICES */
  SERVICES: new Set([
    'bullseye'
  ]),

  /* TOKEN */
  TOKEN_ALGORITHM: 'RS256',
  TOKEN_EXPIRATION: (60 * 60), // is in seconds, not milliseconds
  TOKEN_THRESHOLD: (10 * 60)   // is in seconds, not milliseconds
};
