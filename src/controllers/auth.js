const Auth = require('../utils/auth');
const Response = require('../utils/response');
const Token = require('../utils/token');
const User = require('../models/user');
const { ERROR } = require('../constants');

const authenticate = (req, res) => {
  const {
    username = null,
    password = null
  } = req.body;

  let _user = null;

  if (username === null) {
    const error = new Error('no username found');
    error.data = ERROR.INVALID_ARG;
    Response.error(error, req, res);
  } else if (password === null) {
    const error = new Error('no password found');
    error.data = ERROR.INVALID_ARG;
    Response.error(error, req, res);
  } else {
    // get user with username from database
    // authenticate
    User.get({ username })
      .then(results => results.users[0])
      .then(user => {
        _user = user;
        return Auth.isValidPassword(password, _user.password);
      })
      .then(() => Token.generate({
        username: _user.username,
        r: _user.permissions,
        id: _user.id
      }))
      .then(token => Response.send({}, req, res, token))
      .catch(err => {
        let error = null;

        if (err.data) {
          error = err;
        } else {
          error = new Error(err.message);
          error.data = ERROR.GEN;
        }

        Response.error(error, req, res);
      });
  }
};

module.exports = authenticate;
