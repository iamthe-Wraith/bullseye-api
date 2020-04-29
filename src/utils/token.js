const fs = require('fs');
const jwt = require('jsonwebtoken');

const {
  ERROR,
  TOKEN_ALGORITHM,
  TOKEN_EXPIRATION
} = require('../constants');

// secret should never be a simple string like this...
// should be key generated with something like openssl
// only doing this for dev env
const secret = process.env.SECRET || 'supersecretpasscode';

class Token {
  static generate (payload) {
    if (payload) {

      return jwt.sign(
        payload,
        secret,
        {
          expiresIn: TOKEN_EXPIRATION
        }
      );
    } else {
      const error = new Error('a payload is required to generate a token');
      error.data = ERROR.INVALID_ARG;
      throw error;
    }
  }

  static verify (token) {
    return new Promise((resolve, reject) => {
      if (token) {
        jwt.verify(token, secret, (err, payload) => {
          if (err) {
            reject(err);
          } else {
            resolve(payload);
          }
        });
      } else {
        const error = new Error('no token received');
        error.data = ERROR.INVALID_ARG;
        reject(error);
      }
    });
  }
}

module.exports = Token;
