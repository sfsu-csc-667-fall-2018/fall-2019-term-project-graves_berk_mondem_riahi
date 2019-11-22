'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('handcards', {
      hardcards_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      player_id: {
        allowNull: false,
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
          fields: ['player_id', 'game_id', 'card_id']
        }
      ]
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('handcards');
  }
};