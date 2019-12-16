'use strict';
module.exports = (sequelize, DataTypes) => {
  const handcards = sequelize.define('handcards', {
    hardcards_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    player_id: {
      allowNull: false,
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
  handcards.associate = function(models) {
    // associations can be defined here
    handcards.belongsTo(models.players);
    handcards.belongsTo(models.rooms);
  };
  return handcards;
};