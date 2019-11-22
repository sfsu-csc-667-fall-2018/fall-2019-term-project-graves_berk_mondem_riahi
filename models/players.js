'use strict';
module.exports = (sequelize, DataTypes) => {
  const players = sequelize.define('players', {
    player_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    user_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    room_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
  }, {
    timestamps: false
  });
  players.associate = function(models) {
    // associations can be defined here
  };
  return players;
};