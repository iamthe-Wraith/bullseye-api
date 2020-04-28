const {
  USERNAME_FORMAT,
  EMAIL_FORMAT,
  ERROR
} = require('../constants');

const getPaginationPage = (page = 1) => {
  const _page = typeof page === 'number' ? page : parseInt(page);

  if (isNaN(_page)) {
    const error = new Error('invalid page parameter found. page must be a number');
    error.data - ERROR.INVALID_ARG;
    throw error;
  } else {
    return _page;
  }
}

const isValidUsername = (username) => {
  return USERNAME_FORMAT.test(username);
};

const isValidEmail = (email) => {
  return EMAIL_FORMAT.test(email);
};

const isValidPassword = (password) => {
  return password.length > 6;
};

module.exports = {
  getPaginationPage,
  isValidUsername,
  isValidEmail,
  isValidPassword
};
