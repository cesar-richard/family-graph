const Sequelize = require('sequelize');

exports.getModel = db => {
  const edges = db.define('edges', {
    from: Sequelize.INTEGER,
    to: Sequelize.INTEGER,
    arrows: Sequelize.STRING,
    dashes: Sequelize.BOOLEAN
  });
  edges.associate = function(models) {};
  return edges;
};
