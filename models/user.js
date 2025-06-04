'use strict';
const {
  Model
} = require('sequelize');

const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Profile);
      User.hasMany(models.Order);
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          args: true,
          msg: 'Username is required.'
        },
        notEmpty: {
          args: true,
          msg: 'Username is required.'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          args: true,
          msg: 'Email is required.'
        },
        notEmpty: {
          args: true,
          msg: 'Email is required.'
        },
        isEmail: {
          args: true,
          msg: 'Please input correct email!'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Password is required.'
        },
        notEmpty: {
          args: true,
          msg: 'Password is required.'
        }
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Select your role first!'
        },
        notEmpty: {
          args: true,
          msg: 'Select your role first!'
        }
      }
    }
  }, {
    hooks: {
      beforeCreate: async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt);
        
        user.password = hash;
      },
      afterCreate: (user) => {
        sequelize.models.Profile.create({name: `no-name-${Date.now()}`, address: 'No Address', UserId: user.id, createdAt: new Date(), updatedAt: new Date()});
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};