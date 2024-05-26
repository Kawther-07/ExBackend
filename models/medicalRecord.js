
// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database');
// const validBloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const moment = require('moment');

// const MedicalRecord = sequelize.define('medical_record', {
//     id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     patientId: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         references: {
//             model: 'patient',
//             key: 'id'
//         }
//     },
//     doctorId: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         references: {
//             model: 'doctor',
//             key: 'id'
//         }
//     },
//     diabetesType: {
//         type: DataTypes.STRING,
//         allowNull: true
//     },
//     hasDFU: {
//         type: DataTypes.BOOLEAN,
//         allowNull: true
//     },
//     isSmoker: {
//         type: DataTypes.BOOLEAN,
//         allowNull: true
//     },
//     hadDiabetes: {
//         type: DataTypes.DATEONLY,
//         allowNull: true
//     },
//     bloodGroup: {
//         type: DataTypes.STRING,
//         allowNull: true,
//         validate: {
//             isValidBloodGroup(value) {
//                 if (value && !validBloodGroups.includes(value.toUpperCase())) {
//                     throw new Error('Invalid blood group');
//                 }
//             }
//         }
//     }
// }, {
//     timestamps: true, 
//     underscored: true,
//     tableName: 'medical_record'
// });

// // Define virtual fields for formatted timestamps
// MedicalRecord.prototype.toJSON = function() {
//     const values = Object.assign({}, this.get());

//     // Format timestamps
//     values.createdAtFormatted = moment(this.createdAt).format('YYYY-MM-DD HH:mm A');
//     values.updatedAtFormatted = moment(this.updatedAt).format('YYYY-MM-DD HH:mm A');

//     // Exclude original timestamps
//     delete values.createdAt;
//     delete values.updatedAt;

//     return values;
// };

// module.exports = MedicalRecord;


const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const validBloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const MedicalRecord = sequelize.define('medical_record', {

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const validBloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const moment = require("moment");

const MedicalRecord = sequelize.define(
  "medical_record",
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
    doctorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "doctor",
        key: "id",
      },
    },
    diabetesType: {

        type: DataTypes.STRING,
        allowNull: true
    },
    hasDFU: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    isSmoker: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    hadDiabetes: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    bloodGroup: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isValidBloodGroup(value) {
                if (value && !validBloodGroups.includes(value.toUpperCase())) {
                    throw new Error('Invalid blood group');
                }
            }
        }
    }
}, {

      type: DataTypes.STRING,
      allowNull: false,
    },
    hasDFU: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    isSmoker: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    hadDiabetes: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    bloodGroup: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isValidBloodGroup(value) {
          if (value && !validBloodGroups.includes(value.toUpperCase())) {
            throw new Error("Invalid blood group");
          }
        },
      },
    },
  },
  {

    timestamps: true,
    underscored: true,
    tableName: "medical_record",
  }
);

MedicalRecord.prototype.toJSON = function() {
    const values = { ...this.get() };
    values.createdAtFormatted = moment(this.createdAt).format('YYYY-MM-DD HH:mm A');
    values.updatedAtFormatted = moment(this.updatedAt).format('YYYY-MM-DD HH:mm A');
    delete values.createdAt;
    delete values.updatedAt;
    return values;

// Define virtual fields for formatted timestamps
MedicalRecord.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());

  // Format timestamps
  values.createdAtFormatted = moment(this.createdAt).format("YYYY-MM-DD HH:mm A");
  values.updatedAtFormatted = moment(this.updatedAt).format("YYYY-MM-DD HH:mm A");

  // Exclude original timestamps
  delete values.createdAt;
  delete values.updatedAt;

  return values;

};

module.exports = MedicalRecord;
