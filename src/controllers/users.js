const Users = require('../models/users');
const User = require('../models/user');
const Response = require('../utils/response');

class UsersControllers {
  static get (req, res) {
    Users.get(req.query)
      .then(users => {
        Response.send({
          users: users.map(user => User.getSharable(user))
        }, res); 
      })
      .catch(err => {
        Response.error(err, res);
      });
  }
}

module.exports = UsersControllers;
