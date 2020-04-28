module.exports = {
  /* DB */
  DEFAULT_USERS_TO_RETURN: 10,
  MAX_USERS_TO_RETURN: 100,
  DEFAULT_PRODUCTS_TO_RETURN: 20,
  MAX_PRODUCTS_TO_RETURN: 100,
   
  /* ERRORS */
  ERROR: {
    AUTHENTICATION: { name: 'Authentication', code: 401 },
    CONFLICT: { name: 'Conflict', code: 409 },
    GEN: { name: 'Error', code: 400 },
    INVALID_ARG: { name: 'InvalidArgument', code: 422 },
    NOT_ALLOWED: { name: 'NotAllowed', code: 405 },
    NOT_FOUND: { name: 'NotFound', code: 404 },
    SERVICE: { name: 'ServiceError', code: 422 },
    UNAUTHORIZED: { name: 'Unauthorized', code: 403 },
    UNPROCESSABLE: { name: 'UnprocessableEntity', code: 422 }
  },

  /* FORMATS */
  EMAIL_FORMAT: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  USERNAME_FORMAT: /^[a-zA-Z0-9]*$/,

  /* HEADERS */
  AUTHORIZATION_HEADER: 'Authorization',
  SERVICE_NAME_HEADER: 'serviceName',

  /* ROUTES */
  API_ROUTE: '/api',
  PRODUCTS_ROUTE: '/products',
  USERS_ROUTE: '/users',

  /* SERVICES */
  SERVICES: new Set([
    'bullseye'
  ])
};
