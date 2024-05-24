
const Glycemia = require('../models/glycemia');
const moment = require('moment');

const glycemiaService = require('../services/glycemiaService');
const MedicalRecord = require('../models/medicalRecord');

// Controller function to create a new glycemia record
exports.createGlycemiaRecord = async (req, res) => {
    try {
        const { medicalRecordId, rate } = req.body;
        console.log(`Received create request - Medical Record ID: ${medicalRecordId}, Rate: ${rate}`);

        // Call the service function to create the glycemia record
        const glycemiaRecord = await glycemiaService.createGlycemiaRecord(medicalRecordId, rate);
        console.log('Created glycemia record:', glycemiaRecord);

        // Return the created glycemia record as JSON response
        res.status(201).json(glycemiaRecord);
    } catch (error) {
        console.error('Error creating glycemia record:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Controller function to get glycemia records by patient ID
exports.getGlycemiaRecordsByPatientId = async (req, res) => {
    try {
        const { patientId } = req.params;
        console.log(`Fetching glycemia records for patient ID: ${patientId}`);

        // Call the service function to fetch glycemia records for the specified patient
        const glycemiaRecords = await glycemiaService.getGlycemiaRecordsByPatientId(patientId);
        console.log('Fetched glycemia records:', glycemiaRecords);

        // Return the fetched glycemia records as JSON response
        res.status(200).json(glycemiaRecords);
    } catch (error) {
        console.error('Error fetching glycemia records:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};