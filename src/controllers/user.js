const User = require('../models/user');
const Response = require('../utils/response');
const { ERROR } = require('../constants');

class UserControllers {
  static create (req, res){
    const {
      username = null,
      email = null,
      password = 'password'
    } = req.body;

    if (username && email) {
      /*
       * DO NOT EVER STORE PASSWORD LIKE THIS!!!!
       * PASSWORDS SHOULD ALWAYS BE HASHED BEFORE BEING STORED IN DB!!!
       */
      User.create(username, email, password)
        .then(user => Response.send({ user: User.getSharable(user) }, res))
        .catch(err => Response.error(err, res));
    } else {
      const error = new Error(`no ${!username ? 'username' : 'email'} found`);
      error.data = ERROR.UNPROCESSABLE;
      Response.error(error, res);
    }
  }

  static delete (req, res) {
    const { username = null } = req.params;

    if (username) {
      User.delete(username)
        .then(user => Response.send({}, res))
        .catch(err => Response.error(err, res));
    } else {
      const error = new Error('no username found');
      error.data = ERROR.UNPROCESSABLE;
      Response.error(error, res);
    }
  }

  static get (req, res) {
    const { username = null } = req.params;

    let query = {};

    if (username) {
      query.username = username;
    } else {
      query.query = req.query;
    }

    User.get(query)
      .then(results => {
        if (username) {
          Response.send({ user: User.getSharable(results.users[0]) }, res);
        } else {
          Response.send({
            users: results.users.map(user => User.getSharable(user)),
            count: results.count
          }, res);
        }
      })
      .catch(err => Response.error(err, res));
  }

  static update (req, res) {
    const { username } = req.params;

    if (username) {
      User.update(username, req.body)
        .then(user => Response.send({ user: User.getSharable(user) }, res))
        .catch(err => Response.error(err, res));
    } else {
      const error = new Error('no username found');
      error.data = ERROR.UNPROCESSABLE;
      Response.error(error, res);
    }
  };
}

module.exports = UserControllers;
