'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('nodes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      label: {
        type: Sequelize.STRING
      },
      x: {
        type: Sequelize.FLOAT
      },
      y: {
        type: Sequelize.FLOAT
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      },
      UPDATED_AT: {
        type: Sequelize.DATE
      }
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('nodes');
  }
};
