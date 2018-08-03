const Sequelize = require('sequelize');

exports.getModel = db => {
  const visits = db.define('visits', {
    username: Sequelize.STRING,
    route: Sequelize.STRING
  });
  visits.associate = function(models) {};
  return visits;
};
