'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('discards', {
      discard_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      room_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      card_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      }
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['room_id', 'card_id']
        }
      ]
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('discards');
  }
};