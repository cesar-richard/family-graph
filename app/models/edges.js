const Sequelize = require('sequelize');

exports.getModel = db => {
  const edges = db.define('edges', {
    arrows: {
      type: Sequelize.STRING,
      defaultValue: 'to'
    },
    dashes: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    creator: Sequelize.STRING
  });
  edges.associate = function(models) {
    edges.belongsTo(models.nodes, { as: 'parent', foreignKey: 'from' });
    edges.belongsTo(models.nodes, { as: 'child', foreignKey: 'to' });
  };
  return edges;
};
