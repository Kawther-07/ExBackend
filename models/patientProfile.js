const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const moment = require("moment");

const PatientPersonalProfile = sequelize.define(
  "patient_personal_Profile",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "patient",
        key: "id",
      },
    },

    
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    height: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    birth_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    // pic: {
    //     type: DataTypes.BLOB,
    //     allowNull: true
    // }
  },
  {
    timestamps: true,
    underscored: true,
    tableName: "patient_personal_profile",
  }
);

// Define virtual fields for formatted timestamps
PatientPersonalProfile.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());

  // Format timestamps
  values.createdAtFormatted = moment(this.createdAt).format("YYYY-MM-DD HH:mm A");
  values.updatedAtFormatted = moment(this.updatedAt).format("YYYY-MM-DD HH:mm A");

  // Exclude original timestamps
  delete values.createdAt;
  delete values.updatedAt;

  return values;
};

module.exports = PatientPersonalProfile;
