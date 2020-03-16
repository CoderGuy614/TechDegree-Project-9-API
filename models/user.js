//users model
const Sequelize = require("sequelize");

module.exports = sequelize => {
  class User extends Sequelize.Model {}
  User.init(
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "First Name must not be left blank."
          }
        }
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Last name must not be left blank."
          }
        }
      },
      emailAddress: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Email address must not be left blank."
          },
          isEmail: {
            msg: "Email address is invalid. Please try again."
          }
        },
        unique: {
          args: true,
          msg: "Email address already exists."
        }
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Password must not be left blank."
          }
        }
      }
    },
    { sequelize }
  );

  User.associate = models => {
    User.hasMany(models.Course, {
      as: "user",
      foreignKey: {
        fieldName: "userId",
        allowNull: false
      }
    });
  };

  return User;
};
