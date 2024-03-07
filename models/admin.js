const { DataTypes, Sequelize } = require('sequelize');
const bcrypt = require("bcrypt");

// Initialize Sequelize connection
const sequelize = new Sequelize('DFU_DB4', 'postgres', 'kawther1234', {
  host: 'localhost',
  dialect: 'postgres',
});

// Define the Admin model
const Admin = sequelize.define('admin', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        // defaultValue: Sequelize.UUIDV4
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
        allowNull: false
    },
    phone: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false
    }

});

// Hash password before saving
Admin.beforeCreate(async (admin) => {
    const salt = await bcrypt.genSalt(10);
    admin.mot_de_passe = await bcrypt.hash(admin.password, salt);
});

// Method to compare passwords
Admin.prototype.compareMot_de_passe = async function (candidateMot_de_passe) {
    return bcrypt.compare(candidateMot_de_passe, this.password);
};

// Synchronize the model with the database
sequelize.sync()
  .then(() => {
    console.log('Admin model synchronized with database');
  })
  .catch(err => console.error('Error syncing Admin model:', err));

module.exports = Admin;
