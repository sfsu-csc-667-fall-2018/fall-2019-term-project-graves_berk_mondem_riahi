'use strict';
module.exports = (sequelize, DataTypes) => {
  const discards = sequelize.define('discards', {
    discard_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    room_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    card_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
  }, {
    timestamps: false
  });
  discards.associate = function(models) {
    // associations can be defined here
  };
  return discards;
};