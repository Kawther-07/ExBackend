const Sequelize = require("sequelize");
const sequelize = require("../config/database"); // Adjust the path as necessary
const PatientPersonalProfile = require("./patientProfile");
const Patient = require("./patient");
const MedicalRecord = require("./medicalRecord");
const Doctor = require("./doctor");

// Setup associations
PatientPersonalProfile.belongsTo(Patient, { foreignKey: "patientId" });
Patient.hasOne(PatientPersonalProfile, { foreignKey: "patientId" });

MedicalRecord.belongsTo(Doctor, { foreignKey: "doctorId" });
Doctor.hasMany(MedicalRecord, { foreignKey: "doctorId" });

MedicalRecord.belongsTo(Patient, { foreignKey: "patientId" });
Patient.hasOne(MedicalRecord, { foreignKey: "patientId" }); // Changed to hasOne for one-to-one relationship

// Export models and sequelize connection
module.exports = {
  sequelize,
  Sequelize,
  Patient,
  Doctor,
  MedicalRecord,
  PatientPersonalProfile,
};