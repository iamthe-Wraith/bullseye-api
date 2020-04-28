const UserSchema = require('../schemas/user');
const {
  DEFAULT_USERS_TO_RETURN,
  ERROR,
  MAX_USERS_TO_RETURN
} = require('../constants');
const { getPaginationPage } = require('../utils/helpers');

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

  static get (q) {
    const query = {};
    let page = 1;
    let skipLimit = DEFAULT_USERS_TO_RETURN;

    if (q.username) query.username = q.username;
    
    if (q.query) {
      if (q.query.page) page = getPaginationPage(q.query.page);
      if (q.query.numUsers) {
        const numUsers = parseInt(q.query.numUsers);

        if (!isNaN(numUsers)) {
          skipLimit = numUsers < MAX_USERS_TO_RETURN ? numUsers : MAX_USERS_TO_RETURN;
        }
      }
      if (q.query.username) query.username = { $regex: q.query.username };
      if (q.query.email) query.email = { $regex: q.query.email };
    }

    let skipCount = (page - 1) * skipLimit;
    let results = {};

    return UserSchema.find(query)
      .skip(skipCount)
      .limit(skipLimit)
      .sort({ username: 'ascending' })
      .then(users => {
        if (users.length) {
          results.users = users;
        } else {
          let error = null;

          if (q.username) {
            error = new Error(`${q.username} not found`);
          } else if (q.query) {
            error = new Error('no users matching the provided query were found');
          } else {
            error = new Error('no users found');
          }

          error.data = ERROR.NOT_FOUND;
          throw error;
        }
      })
      .then(() => new Promise((resolve, reject) => {
        if (query.username) {
          resolve(results);
        } else {
          UserSchema.countDocuments(query, (err, count) => {
            if (err) {
              const error = new Error(err.message);
              error.data = ERROR.GEN;
              reject(error);
            } else {
              results.count = count;
              resolve(results);
            }
          })
        }
      }))
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
