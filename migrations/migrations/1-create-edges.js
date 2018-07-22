'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('edges', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      from: {
        type: Sequelize.INTEGER
      },
      to: {
        type: Sequelize.INTEGER
      },
      arrows: {
        type: Sequelize.STRING
      },
      dashes: {
        type: Sequelize.BOOLEAN
      },
      creator: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable('edges');
  }
};
