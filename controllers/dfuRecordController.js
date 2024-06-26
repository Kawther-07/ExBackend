const DfuRecordService = require('../services/dfuRecordService');
const DfuRecord = require('../models/dfuRecord');
const admin = require('../config/firebase');
const { Op } = require('sequelize');

exports.createDfuRecordWithImage = async (req, res) => {
  try {
    console.log('Request received to create DFU record with image');
    console.log('Request body:', req.body);

    const { medicalRecordId, imageUrl, prediction } = req.body;

    if (!medicalRecordId || !imageUrl || !prediction) {
      console.log('Missing medicalRecordId, imageUrl, or prediction');
      return res.status(400).json({ success: false, message: 'Missing medicalRecordId, imageUrl, or prediction' });
    }

    const dfuRecordData = { medicalRecordId, image: imageUrl, prediction };
    console.log('DFU record data:', dfuRecordData);

    const dfuRecord = await DfuRecordService.createDfuRecord(dfuRecordData);
    console.log('DFU record created:', dfuRecord);

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

exports.getDfuRecordsByMedicalRecordId = async (req, res) => {
  try {
    const { patientId } = req.params;

    console.log('Request received to get latest DFU record by patient ID:', patientId);

    const dfuRecords = await DfuRecordService.getDfuRecordsByPatientId(patientId);

    if (!dfuRecords || dfuRecords.length === 0) {
      console.log('No DFU records found for patient ID:', patientId);
      return res.status(404).json({ status: false, message: 'No DFU records found' });
    }

    const latestDfuRecord = dfuRecords[0]; // Assuming the first record is the latest based on DESC order
    console.log('Latest DFU record retrieved successfully:', latestDfuRecord.toJSON());
    return res.status(200).json({ status: true, dfuRecord: latestDfuRecord });
  } catch (error) {
    console.error('Error retrieving DFU records:', error);
    return res.status(500).json({ status: false, message: 'Internal server error' });
  }
};

exports.getDFURecordsByDoctorId = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const dfuRecords = await DfuRecordService.getDfuRecordsByDoctorId(doctorId);

    if (!dfuRecords || dfuRecords.length === 0) {
      return res.status(200).json({ status: false, message: 'No DFU records found' });
    }

    return res.status(200).json({ status: true, dfuRecords });
  } catch (error) {
    return res.status(500).json({ status: false, message: 'Internal server error' });
  }
}



