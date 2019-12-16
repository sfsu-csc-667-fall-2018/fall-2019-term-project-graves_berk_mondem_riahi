'use strict';
module.exports = (sequelize, DataTypes) => {
  const decks = sequelize.define('decks', {
    deck_id: {
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
  decks.associate = function(models) {
    // associations can be defined here
    decks.belongsTo(models.rooms);
  };
  return decks;
};