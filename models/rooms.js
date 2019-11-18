'use strict';
module.exports = (sequelize, DataTypes) => {
  const rooms = sequelize.define('rooms', {
    game_id: DataTypes.INTEGER,
    room_name: DataTypes.STRING,
    host_id: DataTypes.INTEGER,
    guest_id: DataTypes.INTEGER
  }, {});
  rooms.associate = function(models) {
    // associations can be defined here
  };
  return rooms;
};