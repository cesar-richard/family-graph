const Sequelize = require('sequelize');

exports.getModel = db => {
  const nodes = db.define('nodes', {
    label: Sequelize.STRING,
    x: Sequelize.FLOAT,
    y: Sequelize.FLOAT
  });
  nodes.associate = function(models) {};
  return nodes;
};
