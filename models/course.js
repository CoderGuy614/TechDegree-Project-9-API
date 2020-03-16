//courses model
const Sequelize = require("sequelize");

module.exports = sequelize => {
  class Course extends Sequelize.Model {}
  Course.init(
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Title must not be left blank."
          }
        }
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Description must not be left blank."
          }
        }
      },
      estimatedTime: {
        type: Sequelize.STRING
      },
      materialsNeeded: {
        type: Sequelize.STRING
      }
    },
    { sequelize }
  );

  Course.associate = models => {
    Course.belongsTo(models.User, {
      as: "user",
      foreignKey: {
        fieldName: "userId",
        allowNull: true
      }
    });
  };

  return Course;
};
