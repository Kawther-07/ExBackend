const DfuRecord = require('../models/dfuRecord');

exports.createDfuRecord = async (data) => {
  try {
    // Create DFU record in the database
    const dfuRecord = await DfuRecord.create(data);
    console.log('DFU record created:', dfuRecord);
    return dfuRecord;
  } catch (error) {
    console.error('Error creating DFU record:', error);
    throw new Error('Internal server error');
  }
};

exports.getDfuRecordsByPatientId = async (patientId) => {
  try {
    // Retrieve DFU records by patient ID from the database
    const dfuRecords = await DfuRecord.findAll({ where: { medicalRecordId: patientId } });
    console.log('DFU records retrieved:', dfuRecords);
    return dfuRecords;
  } catch (error) {
    console.error('Error retrieving DFU records:', error);
    throw new Error('Internal server error');
  }
};
