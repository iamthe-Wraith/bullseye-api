const bcrypt = require('bcrypt');

const {
  ERROR,
  SALT_ROUNDS
} = require('../constants');

class Auth {
  static generatePasswordHash (password) {
    return new Promise((resolve, reject) => {
      if (password) {
        bcrypt.genSalt(SALT_ROUNDS, (err, salt) => {
          if (err) {
            reject(err);
          } else {
            bcrypt.hash(password, salt, (err, hash) => {
              if (err) {
                reject(err);
              } else {
                resolve(hash);
              }
            });
          }
        });
      } else {
        const error = new Error('password is required');
        error.data = ERROR.INVALID_ARG;
        reject(error);
      }
    });
  }

  static isValidPassword (providedPassword, encryptedPassword) {
    return new Promise((resolve, reject) => {
      if (typeof providedPassword !== 'undefined' && typeof encryptedPassword !== 'undefined') {
        bcrypt.compare(providedPassword, encryptedPassword, (err, authenticated) => {
          if (err) {
            reject(err);
          } else {
            if (authenticated) {
              resolve();
            } else {
              const error = new Error('invalid username or password');
              error.data = ERROR.AUTHENTICATION;
              reject(error);
            }
          }
        });
      } else {
        const message = typeof providedPassword === 'undefined'
          ? 'no password found'
          : 'no encrypted password found';

        const error = new Error(message);
        error.name = ERROR.INVALID_ARG;
        reject(error);
      }
    });
  }
}

module.exports = Auth;
