const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [20, 60],
        msg: 'Name must be between 20 and 60 characters.'
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        msg: 'Must follow standard email validation rules.'
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING(400),
    allowNull: false,
    validate: {
      max: {
        args: [400],
        msg: 'Address cannot exceed 400 characters.'
      }
    }
  },
  role: {
    type: DataTypes.ENUM('System Administrator', 'Normal User', 'Store Owner'),
    allowNull: false,
    defaultValue: 'Normal User'
  }
}, {
  timestamps: true,
  tableName: 'users'
});

module.exports = User;