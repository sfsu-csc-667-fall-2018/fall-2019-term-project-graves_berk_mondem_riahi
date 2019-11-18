'use strict';
module.exports = (sequelize, DataTypes) => {
  const handcards = sequelize.define('handcards', {
    player_id: DataTypes.INTEGER,
    game_id: DataTypes.INTEGER,
    card_id: DataTypes.INTEGER
  }, {});
  handcards.associate = function(models) {
    // associations can be defined here
  };
  return handcards;
};