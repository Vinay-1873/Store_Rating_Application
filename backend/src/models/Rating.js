const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Rating = sequelize.define('Rating', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  value: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: {
        args: [1],
        msg: 'Rating must be at least 1.'
      },
      max: {
        args: [5],
        msg: 'Rating cannot exceed 5.'
      }
    }
  }
  // userId and storeId will be added automatically by our relationships
}, {
  timestamps: true,
  tableName: 'ratings'
});

module.exports = Rating;