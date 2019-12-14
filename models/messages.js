'use strict';
module.exports = (sequelize, DataTypes) => {
  const messages = sequelize.define('messages', {
    message_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    message_text: {
      allowNull: false,
      type: DataTypes.STRING
    },
    room_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    user_id: {
      type: DataTypes.INTEGER
    },
    time_stamp: {
      type: DataTypes.DATE
    },
  }, {
    timestamps: false
  });
  messages.associate = function(models) {
    // associations can be defined here
    messages.belongsTo(models.users);
    messages.belongsTo(models.rooms);
  };
  return messages;
};