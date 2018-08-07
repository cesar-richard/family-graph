const Sequelize = require('sequelize');

exports.getModel = db => {
  const nodes = db.define('nodes', {
    label: Sequelize.STRING,
    x: {
      type: Sequelize.FLOAT,
      defaultValue: 0.0
    },
    y: {
      type: Sequelize.FLOAT,
      defaultValue: 0.0
    },
    shape: {
      type: Sequelize.STRING
    },
    image: {
      type: Sequelize.STRING
    }
  });
  nodes.associate = function(models) {};
  return nodes;
};
