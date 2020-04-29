const mongoose = require('mongoose');

const { PERMISSIONS } = require('../constants');
const {
  isValidUsername,
  isValidEmail,
  isValidPassword
} = require('../utils/helpers');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'username is required'],
    validate: {
      validator: isValidUsername,
      message: 'username must only contain alphanumeric characters'
    }
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    validate: {
      validator: isValidEmail,
      message: 'invalid email format'
    }
  },
  password: {
    type: String,
    required: [true, 'password is required'],
    validate: {
      validator: isValidPassword,
      message: 'password must be greater than 6 characters'
    }
  },
  permissions: {
    type: Number,
    required: [true, 'permissions are required'],
    validate: {
      validator: p => {
        const pNum = parseInt(p);
        return (!isNaN(pNum) && Object.values(PERMISSIONS).filter(permission => pNum === permission.lvl).length);
      },
      message: 'invalid permissions received'
    }
  }
});

module.exports = mongoose.model('user', UserSchema);
