const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EducationalResource = sequelize.define('educational_resource', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  article: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  timestamps: true,
  underscored: true,
  tableName: 'educational_resources',
});

module.exports = EducationalResource;
