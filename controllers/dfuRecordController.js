const DfuRecordService = require('../services/dfuRecurdService');
const DfuRecord = require('../models/dfuRecord');


exports.createDfuRecord = async (req, res) => {
    try {
      // Extract data from the request body
      const { medicalRecordId, view, description, image } = req.body;
  
      // Save the image data to the database (example implementation)
      const dfuRecordData = { medicalRecordId, view, description, image };
      const dfuRecord = await DfuRecordService.createDfuRecord(dfuRecordData);
  
      // Return the created DFU record as JSON response
      res.status(201).json({ status: true, dfuRecord });
    } catch (error) {
      console.error('Error creating DFU record:', error);
      res.status(500).json({ status: false, message: 'Internal server error' });
    }
  };

exports.getDfuRecordsByPatientId = async (req, res) => {
  try {
    // Extract patient ID from the request parameters
    const { patientId } = req.params;

    // Retrieve DFU records by patient ID using the service function
    const dfuRecords = await DfuRecordService.getDfuRecordsByPatientId(patientId);

    // Return DFU records as JSON response
    res.status(200).json({ status: true, dfuRecords });
  } catch (error) {
    console.error('Error retrieving DFU records:', error);
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
};
