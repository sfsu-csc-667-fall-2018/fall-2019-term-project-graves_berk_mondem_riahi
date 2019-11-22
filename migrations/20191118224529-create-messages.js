'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('messages', {
      message_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      room_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      time_stamp: {
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('messages');
  }
};