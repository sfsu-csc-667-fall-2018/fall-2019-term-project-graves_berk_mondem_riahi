'use strict';
module.exports = (sequelize, DataTypes) => {
  const messages = sequelize.define('messages', {
    message_id: DataTypes.INTEGER,
    game_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    time_stamp: DataTypes.DATE
  }, {});
  messages.associate = function(models) {
    // associations can be defined here
  };
  return messages;
};