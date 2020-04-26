const { ERROR } = require('../constants');

class Response {
  static send (data, res) {
    res.json(data);
  }

  static error (err, res) {
    const errorData = !!err.data ? err.data : ERROR.GEN;
    res.status(errorData.code).json({ message: err.message });
  }
}

module.exports = Response;
