const DfuRecord = require('../models/dfuRecord');

exports.createDfuRecord = async (data) => {
  try {
    const dfuRecord = await DfuRecord.create(data);
    console.log('DFU record created:', dfuRecord);
    return dfuRecord;
  } catch (error) {
    console.error('Error creating DFU record:', error);
    throw new Error('Internal server error');
  }
};

exports.getDfuRecordsByPatientId = async (medicalRecordId) => {
  try {
    const dfuRecords = await DfuRecord.findAll({
      where: { medicalRecordId },
      order: [['updatedAt', 'DESC']],
    });
    console.log('DFU records retrieved:', dfuRecords.map(record => record.toJSON()));
    return dfuRecords;
  } catch (error) {
    console.error('Error retrieving DFU records:', error);
    throw new Error('Internal server error');
  }
};

