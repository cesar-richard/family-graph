const Sequelize = require('sequelize');

exports.getModel = db => {
  const edges = db.define('edges', {
    arrows: Sequelize.STRING,
    dashes: Sequelize.BOOLEAN,
    creator: Sequelize.STRING
  });
  edges.associate = function(models) {
  	edges.belongsTo(models.nodes, { as: "from" });
  	edges.belongsTo(models.nodes, { as: "to" });
  };
  return edges;
};
