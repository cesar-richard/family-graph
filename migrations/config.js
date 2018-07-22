const config = require('./../config');
console.log(config);
module.exports = {
  [config.environment]: Object.assign({}, config.database, {
    dialect: 'mysql'
  })
};
