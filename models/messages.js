'use strict';
module.exports = (sequelize, DataTypes) => {
  const messages = sequelize.define('messages', {
    email: DataTypes.STRING,
    message: DataTypes.STRING
  }, {});
  messages.associate = function(models) {
    // associations can be defined here
  };
  return messages;
};