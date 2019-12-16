'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('players', {
      player_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // user_id: {
      //   allowNull: false,
      //   type: Sequelize.INTEGER
      // },
      // room_id: {
      //   allowNull: false,
      //   type: Sequelize.INTEGER
      // }
      points: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('players');
  }
};