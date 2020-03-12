'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class User extends Sequelize.Model {}
  User.init({
    firstName: {
        type: Sequelize.STRING,
        allowNull: false, 
        validate: {
            notNull: {
                msg: 'First Name must not be blank',
            },
            notEmpty: {
                msg: 'First Name must not be blank'         
            }      
        },
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false, 
        validate: {
            notNull: {
                msg: 'Last Name must not be blank',
            },
            notEmpty: {
                msg: 'Last Name must not be blank'         
            }      
        },
    },
    emailAddress: {
        type: Sequelize.STRING,
        allowNull: false, 
        validate: {
            notNull: {
                msg: 'Email Address must not be blank',
            },
            notEmpty: {
                msg: 'Email Address must not be blank'         
            }      
        },
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false, 
        validate: {
            notNull: {
                msg: 'password must not be blank',
            },
            notEmpty: {
                msg: 'password must not be blank'         
            }      
        },
    },
  }, { sequelize });

  return User;
};