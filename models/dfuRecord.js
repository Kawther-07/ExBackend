const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const moment = require("moment");

const DfuRecord = sequelize.define(
  "dfu_record",
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
    prediction: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // description: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    underscored: true,
    tableName: "dfu_record",
  }
);

// Define virtual fields for formatted timestamps
DfuRecord.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());

  // Format timestamps
  values.createdAtFormatted = moment(this.createdAt).format("YYYY-MM-DD HH:mm A");
  values.updatedAtFormatted = moment(this.updatedAt).format("YYYY-MM-DD HH:mm A");

  // Exclude original timestamps
  delete values.createdAt;
  delete values.updatedAt;

  return values;
};
module.exports = DfuRecord;