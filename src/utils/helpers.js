const {
  USERNAME_FORMAT,
  EMAIL_FORMAT
} = require('../constants');

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
  isValidUsername,
  isValidEmail,
  isValidPassword
};
