// const errors = require('../errors');
const logger = require('../logger');

exports.handle = (error, req, res, next) => {
  if (error && error.statusCode) {
    res.status(error.statusCode);
  } else {
    next(error);
    res.status(500);
  }
  logger.error(error);
  return res.send({ error: error.message });
};
