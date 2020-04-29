const User = require('../models/user');
const Response = require('../utils/response');
const {
  AUTHORIZATION_HEADER,
  ERROR,
  PERMISSIONS
} = require('../constants');

class UserControllers {
  static async create (req, res) {
    const { tokenPayload } = req;
    const {
      username = null,
      email = null,
      password = 'Testing123!!'
    } = req.body;

    if (username && email) {
      try {
        const requestor = await User.getRequestor(tokenPayload);

        if (requestor.permissions <= PERMISSIONS.ADMIN.lvl) {
          const user = await User.create(username, email, password);
          Response.send({ user: User.getSharable(user) }, req, res);
        } else {
          const error = new Error('you are not authorized to make this request');
          error.data = ERROR.UNAUTHORIZED;
          Response.error(error, req, res);
        }
      } catch (err) {
        Response.error(err, req, res);
      }
    } else {
      const error = new Error(`no ${!username ? 'username' : 'email'} found`);
      error.data = ERROR.UNPROCESSABLE;
      Response.error(error, req, res);
    }
  }

  static async delete (req, res) {
    const { tokenPayload } = req;
    const { username = null } = req.params;

    if (username) {
      try {
        const requestor = await User.getRequestor(tokenPayload);
        const results = await User.get({ username });
        const user = results.users[0];

        if (requestor.permissions <= PERMISSIONS.ADMIN.lvl && requestor.permissions < user.permissions) {
          await User.delete(username);
          Response.send({}, req, res);
        } else {
          const error = new Error('you are not authorized to make this request');
          error.data = ERROR.UNAUTHORIZED;
          Response.error(error, req, res);
        }
      } catch (err) {
        Response.error(err, req, res);
      }
    } else {
      const error = new Error('no username found');
      error.data = ERROR.UNPROCESSABLE;
      Response.error(error, req, res);
    }
  }

  static async get (req, res) {
    const { tokenPayload } = req;
    const { username = null } = req.params;

    let query = {};
    let requestor = null;

    if (username) {
      query.username = username;
    } else {
      query.query = req.query;
    }

    try {
      const requestor = await User.getRequestor(tokenPayload);

      if (requestor.permissions <= PERMISSIONS.ADMIN.lvl || requestor.username === query.username) {
        const results = await User.get(query);
        
        if (username) {
          Response.send({ user: User.getSharable(results.users[0]) }, req, res);
        } else {
          Response.send({
            users: results.users.map(user => User.getSharable(user)),
            count: results.count
          }, req, res);
        }
      } else {
        const error = new Error('you are not authorized to make this request');
        error.data = ERROR.UNAUTHORIZED;
        Response.error(error, req, res);
      }  
    } catch (err) {
      Response.error(err, req, res);
    }
  }

  static async update (req, res) {
    const { tokenPayload } = req;
    const { username } = req.params;

    if (username) {
      try {
        const requestor = await User.getRequestor(tokenPayload);
        const results = await User.get({ username });
        const user = results.users[0];

        if ((
          requestor.permissions <= PERMISSIONS.ADMIN.lvl &&
          requestor.permissions < user.permissions) ||
          requestor.username === username
        ) {
          const updatedUser = await User.update(username, req.body);
          Response.send({ user: User.getSharable(updatedUser) }, req, res);
        } else {
          const error = new Error('you are not authorized to make this request');
          error.data = ERROR.UNAUTHORIZED;
          Response.error(error, req, res);
        }
      } catch (err) {
        Response.error(err, req, res);
      }
    } else {
      const error = new Error('no username found');
      error.data = ERROR.UNPROCESSABLE;
      Response.error(error, req, res);
    }
  };
}

module.exports = UserControllers;
