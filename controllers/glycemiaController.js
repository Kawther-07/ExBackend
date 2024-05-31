const Glycemia = require('../models/glycemia');
const moment = require('moment');
const { Op } = require('sequelize');
const glycemiaService = require('../services/glycemiaService');
const MedicalRecord = require('../models/medicalRecord');

// Controller function to create a new glycemia record
exports.createGlycemiaRecord = async (req, res) => {
    try {
        const { medicalRecordId, rate } = req.body;
        console.log(`Received create request - Medical Record ID: ${medicalRecordId}, Rate: ${rate}`);

        // Verify if medicalRecordId exists
        const medicalRecord = await MedicalRecord.findByPk(medicalRecordId);
        if (!medicalRecord) {
            return res.status(404).json({ error: 'Medical record not found' });
        }

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

// Controller function to get glycemia records by patient ID and date range
exports.getGlycemiaRecordsByPatientIdAndDateRange = async (req, res) => {
    try {
        const { patientId } = req.params;
        console.log(`Fetching glycemia records for patient ID: ${patientId}`);

        // Get the first and last day of the current month
        const currentDate = new Date();
        const firstDay = moment(currentDate).startOf('month').toDate();
        const lastDay = moment(currentDate).endOf('month').toDate();

        // Fetch medical record IDs for the given patient ID
        const medicalRecords = await MedicalRecord.findAll({ where: { patientId: patientId } });
        const medicalRecordIds = medicalRecords.map(record => record.id);

        console.log('Medical Record IDs:', medicalRecordIds);

        // Fetch glycemia records for the retrieved medical record IDs within the date range
        const glycemiaRecords = await Glycemia.findAll({
            where: {
                medicalRecordId: {
                    [Op.in]: medicalRecordIds
                },
                createdAt: {
                    [Op.between]: [firstDay, lastDay]
                }
            },
        });

        console.log('Fetched glycemia records:', glycemiaRecords);

        // Return the fetched glycemia records as JSON response
        res.status(200).json(glycemiaRecords);
    } catch (error) {
        console.error('Error fetching glycemia records:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
