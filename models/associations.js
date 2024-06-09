const Sequelize = require("sequelize");
const sequelize = require("../config/database"); // Adjust the path as necessary
const PatientPersonalProfile = require("./patientProfile");
const Patient = require("./patient");
const MedicalRecord = require("./medicalRecord");
const Doctor = require("./doctor");
const DfuRecord = require("./dfuRecord");

// Setup associations
PatientPersonalProfile.belongsTo(Patient, { foreignKey: "patientId" });
Patient.hasOne(PatientPersonalProfile, { foreignKey: "patientId" });

MedicalRecord.belongsTo(Doctor, { foreignKey: "doctorId" });
Doctor.hasMany(MedicalRecord, { foreignKey: "doctorId" });

MedicalRecord.belongsTo(Patient, { foreignKey: "patientId" });
Patient.hasOne(MedicalRecord, { foreignKey: "patientId" }); // Changed to hasOne for one-to-one relationship

Patient.belongsTo(Doctor, { as: 'doctor', foreignKey: 'doctorid' });

// Link MedicalRecord with DfuRecord. One DfuRecord belongs to only one MedicalRecord, but one MedicalRecord can have multiple DfuRecords
DfuRecord.belongsTo(MedicalRecord, { foreignKey: "medicalRecordId" });
MedicalRecord.hasMany(DfuRecord, { foreignKey: "medicalRecordId" });

// Export models and sequelize connection
module.exports = {
  sequelize,
  Sequelize,
  Patient,
  Doctor,
  MedicalRecord,
  PatientPersonalProfile,
};