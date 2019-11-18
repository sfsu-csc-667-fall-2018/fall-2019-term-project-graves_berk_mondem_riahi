'use strict';
module.exports = (sequelize, DataTypes) => {
  const discards = sequelize.define('discards', {
    game_id: DataTypes.INTEGER,
    card_id: DataTypes.INTEGER
  }, {});
  discards.associate = function(models) {
    // associations can be defined here
  };
  return discards;
};