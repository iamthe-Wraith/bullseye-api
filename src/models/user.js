const UserSchema = require('../schemas/user');
const { ERROR } = require('../constants');

class User {
  static create (
    username = null,
    email = null,
    password = 'password'
  ) {
    return UserSchema.find({ username })
      .then(users => {
        if (users.length === 0) {
          /*
           * DO NOT EVER STORE PASSWORD LIKE THIS!!!!
           * PASSWORDS SHOULD ALWAYS BE HASHED BEFORE BEING STORED IN DB!!!
           */
          return new UserSchema({ username, email, password });
        } else {
          const error = new Error('username already exists');
          error.data = ERROR.CONFLICT;
          throw error;
        }
      })
      .then(user => user.save())
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

  static delete (username) {
    return UserSchema.findOne({ username })
      .then(user => {
        if (user) {
          return user.remove();
        } else {
          const error = new Error(`${username} not found`);
          error.data = ERROR.NOT_FOUND;
          throw error;
        }
      })
      .then(() => UserSchema.findOne({ username }))
      .then(user => {
        if (user === null) {
          return true;
        } else {
          const error = new Error(`failed to delete ${username}`);
          error.data = ERROR.GEN;
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

  /**
   * gets only the data from user object
   * that should be shared with client
   */
  static getSharable (user) {
    return {
      username: user.username,
      email: user.email
    };
  }

  static get (username) {
    return UserSchema.find({ username })
      .then(users => {
        if (users.length) {
          return users[0];
        } else {
          const error = new Error(`${username} not found`);
          error.data = ERROR.NOT_FOUND;
          throw error;
        }
      })
      .catch(err => {
        let error = null;

        if (err.data) {
          error = err;
        } else {
          error = new Error(err.message);
          error.data = ERROR.GEN;
        }

        throw error;
      });
  }

  static update (username, data) {
    const updatable = {};

    if (data.username) updatable.username = data.username;
    if (data.email) updatable.email = data.email;

    /*
     * DO NOT EVER STORE PASSWORD LIKE THIS!!!!
     * PASSWORDS SHOULD ALWAYS BE HASHED BEFORE BEING STORED IN DB!!!
     */
    if (data.password) updatable.password = data.password;
   
    return UserSchema.findOne({ username })
      .then(user => {
        if (user) {
          user.set(updatable);
          return user.save();
        } else {
          const error = new Error(`${username} not found`);
          error.data = ERROR.NOT_FOUND;
          throw error;
        }
      })
      .then(() => UserSchema.findOne({ username: updatable.username || username }))
      .then(user => {
        if (user) {
          return user;
        } else {
          const error = new Error(`failed to find ${updatable.username || username} after update`);
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

module.exports = User;
