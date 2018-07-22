const config = require('./../config');

module.exports = {
  [config.environment]: Object.assign({}, config.database, {
    dialect: 'mysql'
  })
};
