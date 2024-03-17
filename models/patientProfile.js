const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PatientPersonalProfile = sequelize.define('patient_personalProfile', {
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

    // i'm not sure if it's true or false, i mean we need these info for the recommendation system, don't we?
    gender: {
        type: DataTypes.STRING,
        allowNull: false
    },
    height: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    weight: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    birth_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    pic: {
        type: DataTypes.BLOB,
        allowNull: true
    }
}, {
    timestamps: false
});

module.exports = PatientPersonalProfile;
