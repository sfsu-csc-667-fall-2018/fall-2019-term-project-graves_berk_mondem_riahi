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
    points: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    timestamps: false
  });
  players.associate = function(models) {
    // associations can be defined here
    players.belongsTo(models.users);
    players.belongsTo(models.rooms);
  };
  return players;
};