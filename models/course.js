"use strict";
const Sequelize = require("sequelize");

module.exports = sequelize => {
  class Course extends Sequelize.Model {}
  Course.init(
    {
      id: null, // Integer, primary key, autogenerated
      UserId: null, // id from the users table
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Title must not be blank"
          },
          notEmpty: {
            msg: "Title must not be blank"
          }
        }
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Description must not be blank"
          },
          notEmpty: {
            msg: "Description must not be blank"
          }
        }
      },
      estimatedTime: {
        type: Sequelize.STRING,
        allowNull: true
      },
      materialsNeeded: {
        type: Sequelize.STRING,
        allowNull: true
      }
    },
    { sequelize }
  );
  Course.associate = models => {
    Course.belongsTo(models.User);
  };

  return Course;
};
