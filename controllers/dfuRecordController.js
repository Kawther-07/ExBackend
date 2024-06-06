const DfuRecordService = require('../services/dfuRecordService');
const DfuRecord = require('../models/dfuRecord');
const admin = require('../config/firebase');

exports.createDfuRecordWithImage = async (req, res) => {
  try {
    const { medicalRecordId, imageUrl } = req.body;
    console.log('Request received to create DFU record with image');
    console.log('Medical Record ID:', medicalRecordId);
    console.log('Image URL:', imageUrl);

    if (!medicalRecordId || !imageUrl) {
      console.log('Missing medicalRecordId or imageUrl');
      return res.status(400).json({ success: false, message: 'Missing medicalRecordId or imageUrl' });
    }

    const dfuRecordData = { medicalRecordId, image: imageUrl };
    const dfuRecord = await DfuRecordService.createDfuRecord(dfuRecordData);
    console.log('DFU record created successfully:', dfuRecord);
    res.status(201).json({ status: true, dfuRecord });
  } catch (error) {
    console.error('Error creating DFU record:', error);
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    console.log('Request received to upload image');
    console.log('Request body:', req.body);

    const { medicalRecordId, imageUrl } = req.body;
    console.log('Medical Record ID:', medicalRecordId);
    console.log('Image URL:', imageUrl);

    if (!medicalRecordId || !imageUrl) {
      console.log('Missing medicalRecordId or imageUrl');
      return res.status(400).json({ success: false, message: 'Missing medicalRecordId or imageUrl' });
    }

    const dfuRecord = await DfuRecord.create({ medicalRecordId, image: imageUrl });
    console.log('Image URL saved successfully:', dfuRecord);

    return res.status(200).json({ success: true, message: 'Image URL saved successfully', dfuRecord });
  } catch (error) {
    console.error('Error uploading image URL:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.getDfuRecordsByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;

    console.log('Request received to get latest DFU record by patient ID:', patientId);

    const dfuRecord = await DfuRecord.findOne({
      where: { medicalRecordId: patientId },
      order: [['updatedAt', 'DESC']], // Sort by updatedAt in descending order
    });

    if (!dfuRecord) {
      console.log('No DFU record found for patient ID:', patientId);
      return res.status(404).json({ status: false, message: 'No DFU record found' });
    }

    console.log('Latest DFU record retrieved successfully:', dfuRecord);

    res.status(200).json({ status: true, dfuRecord });
  } catch (error) {
    console.error('Error retrieving DFU record:', error);
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
};

