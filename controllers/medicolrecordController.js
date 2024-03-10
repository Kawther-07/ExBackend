const MedicalRecord = require('../models/medicalRecord');
const MedicalRecordService = require('../services/medicalRecord.service');


exports.createMedicalRecord = async (req, res) => {
    try {
        const { patientId, diabetesType, hasDFU, isSmoker, glycemia, diab_duration, age, height, weight, gender } = req.body;
        
        const medicalRecord = await MedicalRecordService.createMedicalRecord(patientId, diabetesType, hasDFU, isSmoker, glycemia, diab_duration, age, height, weight, gender);

        res.status(201).json({ status: true, message: 'Medical record created successfully', medicalRecord });
    } catch (error) {
        console.error('Error creating medical record:', error);
        res.status(500).json({ status: false, message: 'Internal server error' });
    }
};


exports.getMedicalRecordByPatientId = async (req, res) => {
    try {
        const { patientId } = req.params;

        const medicalRecord = await MedicalRecordService.getMedicalRecordByPatientId(patientId);

        res.status(200).json({ status: true, medicalRecord });
    } catch (error) {
        console.error('Error fetching medical records:', error);
        res.status(500).json({ status: false, message: 'Internal server error' });
    }
};
