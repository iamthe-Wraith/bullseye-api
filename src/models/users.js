const UserSchema = require('../schemas/user');
const { ERROR } = require('../constants');

class Users {
  static get (q = {}) {
    const query = {};
    if (q.username) query.username = { $regex: q.username };
    if (q.email) query.email = { $regex: q.email };

    return UserSchema.find(query)
      .then(users => {
        if (users.length) {
          return users;
        } else {
          const error = new Error(`no users found${Object.keys(query).length ? ' that match the provided query' : ''}`);
          error.data = ERROR.NOT_FOUND;
          throw error;
        }
      })
      .catch(err => {
        let error = null;

        if (err.data) {
          error = err;
        } else if (err.errors) {
          error = new Error(err.errors[Object.keys(err.errors)[0]]);
          error.data = ERROR.INVALID_ARG;
        } else {
          error = new Error(err.message);
          error.data = ERROR.GEN;
        }
        
        throw error;
      });
  }
}

module.exports = Users;
