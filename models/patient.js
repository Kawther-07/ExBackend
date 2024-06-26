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
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isArchived: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    doctorid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'doctor', // Make sure this matches your actual doctor model/table
        key: 'id',
      },
    },
  },
  {
    timestamps: true,
    underscored: true,
    tableName: "patient",
  }
);

Patient.beforeCreate(validatePhone);

function validatePhone(patient) {
  if (patient.phone) {
    const phoneRegex = /^(06|05|07)\d{8}$/;
    if (!phoneRegex.test(patient.phone.toString())) {
      throw new Error("Phone number must start with 06, 05 or 07 and be 10 digits long.");
    }
  }
}

// Method to archive/unarchive a patient
Patient.archivePatient = async function(patientId, isArchived) {
  try {
    const patient = await this.findByPk(patientId);
    if (!patient) {
      throw new Error('Patient not found');
    }
    patient.isArchived = isArchived;
    await patient.save();
    return patient;
  } catch (error) {
    console.error('Error updating patient archive status:', error);
    throw error;
  }
};

module.exports = Patient;
