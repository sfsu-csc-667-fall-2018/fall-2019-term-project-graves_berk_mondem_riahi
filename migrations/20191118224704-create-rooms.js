'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('rooms', {
      room_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      room_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      host_id: {
        type: Sequelize.INTEGER
      },
      guest_id: {
        type: Sequelize.INTEGER
      },
      password: {
        type: Sequelize.STRING
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('rooms');
  }
};