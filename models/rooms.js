'use strict';
module.exports = (sequelize, DataTypes) => {
  const rooms = sequelize.define('rooms', {
    room_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    room_name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    host_id: {
      type: DataTypes.INTEGER
    },
    guest_id: {
      type: DataTypes.INTEGER
    },
    password: {
      type: DataTypes.STRING
    },
  }, {
    timestamps: false
  });
  rooms.associate = function(models) {
    // associations can be defined here
  };
  return rooms;
};