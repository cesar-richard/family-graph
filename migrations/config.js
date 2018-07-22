const config = require('./../config');
console.log({
  [config.environment]: Object.assign({}, config.database, {
    dialect: 'mysql'
  }));
module.exports = {
  [config.environment]: Object.assign({}, config.database, {
    dialect: 'mysql'
  })
};
