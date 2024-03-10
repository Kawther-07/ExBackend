const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Patient = sequelize.define('patient', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    phone: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // age: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false
    // },
    // height: {
    //     type: DataTypes.FLOAT,
    //     allowNull: false
    // },
    // weight: {
    //     type: DataTypes.FLOAT,
    //     allowNull: false
    // },
    // gender: {
    //     type: DataTypes.STRING,
    //     allowNull: false
    // },
    // role: {
    //     type: DataTypes.STRING,
    //     allowNull: false
    // },
}, {
    timestamps: false // Disable timestamps
});
module.exports = Patient;