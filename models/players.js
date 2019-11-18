'use strict';
module.exports = (sequelize, DataTypes) => {
  const players = sequelize.define('players', {
    player_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    game_id: DataTypes.INTEGER
  }, {});
  players.associate = function(models) {
    // associations can be defined here
  };
  return players;
};