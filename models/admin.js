const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Admin = sequelize.define('admin', {
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
        unique: true,
        validate: {
            isEmail: true 
        }
    },
    phone: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    timestamps: false 
});


Admin.beforeCreate(validatePhone);
// Admin.beforeUpdate(validatePhone); needed to comment this for the reset password to work.

function validatePhone(admin) {
    if (admin.phone) {
        const phoneRegex = /^(06|05|07)\d{8}$/;
        if (!phoneRegex.test(admin.phone.toString())) {
            throw new Error('Phone number must start with 06, 05 or 07 and be 10 digits long.');
        }
    }
}

module.exports = Admin;