const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Doctor = sequelize.define(
  "doctor",
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
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    speciality: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pic: {
      type: DataTypes.BLOB,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    underscored: true,
    tableName: "doctor",
  }
);

// Doctor.beforeCreate(validatePhone);
// Doctor.beforeUpdate(validatePhone); needed to comment this for the reset password to work.

// function validatePhone(doctor) {
//   if (doctor.phone) {
//     const phoneRegex = /^(06|05|07)\d{8}$/;
//     if (!phoneRegex.test(doctor.phone.toString())) {
//       throw new Error("Phone number must start with 06, 05 or 07 and be 10 digits long.");
//     }
//   }
// }

module.exports = Doctor;
