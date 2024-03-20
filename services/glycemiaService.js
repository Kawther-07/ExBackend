const Glycemia = require('../models/glycemia');
const MedicalRecord = require('../models/medicalRecord');


// Service function to create a new glycemia record
exports.createGlycemiaRecord = async (medicalRecordId, rate) => {
    try {
        // Create a new glycemia record using Sequelize's create method
        const glycemiaRecord = await Glycemia.create({
            medicalRecordId: medicalRecordId,
            rate: rate,
        });

        return glycemiaRecord;
    } catch (error) {
        console.error('Error creating glycemia record:', error);
        throw new Error('Internal server error');
    }
};



// Service function to get glycemia records by patient ID
exports.getGlycemiaRecordsByPatientId = async (patientId) => {
    try {
        // Step 1: Find medical records associated with the patient ID
        const medicalRecords = await MedicalRecord.findAll({ where: { patientId: patientId } });
        
        // Step 2: Extract the IDs of the medical records
        const medicalRecordIds = medicalRecords.map(record => record.id);
        
        // Step 3: Query glycemia records associated with the medical record IDs
        const glycemiaRecords = await Glycemia.findAll({ where: { medicalRecordId: medicalRecordIds } });

        return glycemiaRecords;
    } catch (error) {
        console.error('Error fetching glycemia records:', error);
        throw new Error('Internal server error');
    }
};