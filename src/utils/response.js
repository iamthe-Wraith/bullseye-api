const {
  AUTHORIZATION_HEADER,
  ERROR
} = require('../constants');

class Response {
  static send (data, req, res, tkn) {
    const token = tkn ? tkn : req.get(AUTHORIZATION_HEADER);

    if (token) {
      // TODO refresh token if is expiring within TOKEN_THRESHOLD minutes of this request

      res.setHeader(AUTHORIZATION_HEADER, token);
    }

    res.json(data);
  }

  static error (err, req, res, tkn) {
    const token = tkn ? tkn : req.get(AUTHORIZATION_HEADER);
    const errorData = !!err.data ? err.data : ERROR.GEN;

    if (token) {
      // TODO refresh token if is expiring within TOKEN_THRESHOLD minutes of this request

      res.setHeader(AUTHORIZATION_HEADER, token);
    }
    res.status(errorData.code).json({ message: err.message });
  }
}

module.exports = Response;
