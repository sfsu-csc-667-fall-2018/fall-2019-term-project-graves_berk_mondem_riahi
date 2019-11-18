'use strict';
module.exports = (sequelize, DataTypes) => {
  const player = sequelize.define('player', {
    player_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    game_id: DataTypes.INTEGER
  }, {});
  player.associate = function(models) {
    // associations can be defined here
  };
  return player;
};