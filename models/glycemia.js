const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const moment = require("moment");

const Glycemia = sequelize.define(
  "glycemia",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    medicalRecordId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "medical_record",
        key: "id",
      },
    },
    rate: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    underscored: true,
    tableName: "glycemia",
  }
);

// Define virtual fields for formatted timestamps
Glycemia.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());

  // Format timestamps without seconds
  values.createdAtFormatted = moment(this.createdAt).format("YYYY-MM-DD HH:mm");
  values.updatedAtFormatted = moment(this.updatedAt).format("YYYY-MM-DD HH:mm");

  // Exclude original timestamps
  delete values.createdAt;
  delete values.updatedAt;

  return values;
};

module.exports = Glycemia;
