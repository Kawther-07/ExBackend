const MedicalRecord = require('../models/medicalRecord');

exports.createMedicalRecord = async (data) => {
    try {
        const record = await MedicalRecord.create(data);
        return record;
    } catch (error) {
        console.error('Error creating medical record:', error);
        throw new Error('Internal server error');
    }
};

exports.getMedicalRecordByPatientId = async (patientId) => {
    try {
        const record = await MedicalRecord.findOne({ where: { patientId } });
        return record;
    } catch (error) {
        console.error('Error fetching medical record:', error);
        throw new Error('Internal server error');
    }
};
