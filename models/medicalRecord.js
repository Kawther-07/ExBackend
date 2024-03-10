const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MedicalRecord = sequelize.define('medical_record', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    patientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'patients',
            key: 'id'
        }
    },
    diabetesType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    hasDFU: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    isSmoker: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    glycemia: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    diab_duration: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    height: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    weight: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    timestamps: false
});

module.exports = MedicalRecord;
