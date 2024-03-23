const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Patient = sequelize.define(
  "patient",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    underscored: true,
    tableName: "patient",
  }
);

Patient.beforeCreate(validatePhone);
// Patient.beforeUpdate(validatePhone); needed to comment this for the reset password to work.

function validatePhone(patient) {
  if (patient.phone) {
    const phoneRegex = /^(06|05|07)\d{8}$/;
    if (!phoneRegex.test(patient.phone.toString())) {
      throw new Error("Phone number must start with 06, 05 or 07 and be 10 digits long.");
    }
  }
}

module.exports = Patient;
