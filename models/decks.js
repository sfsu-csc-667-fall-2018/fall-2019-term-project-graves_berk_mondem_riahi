'use strict';
module.exports = (sequelize, DataTypes) => {
  const decks = sequelize.define('decks', {
    game_id: DataTypes.INTEGER,
    card_id: DataTypes.INTEGER
  }, {});
  decks.associate = function(models) {
    // associations can be defined here
  };
  return decks;
};