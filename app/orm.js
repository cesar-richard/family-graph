const Sequelize = require('sequelize'),
  config = require('./../config'),
  logger = require('./logger'),
  models = require('./models');

exports.DB_URL =
  config.common.database.url ||
  `${config.common.database.dialect}://${config.common.database.username}:${
    config.common.database.password
  }@${config.common.database.host}:${config.common.database.port}/${config.common.database.database}`; // eslint-disable-line max-len

exports.init = () => {
  const db = new Sequelize(exports.DB_URL, {
    logging: config.logger.db
  });
  models.define(db);
  exports.models = db.models;
  return config.isTesting ? Promise.resolve() : db.sync();
};

exports.Op = Sequelize.Op;
