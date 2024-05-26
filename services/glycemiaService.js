const Glycemia = require('../models/glycemia');
const MedicalRecord = require('../models/medicalRecord');


exports.createGlycemiaRecord = async (medicalRecordId, rate) => {
    try {
        console.log(`Creating glycemia record for Medical Record ID: ${medicalRecordId}, Rate: ${rate}`);

        const glycemiaRecord = await Glycemia.create({
            medicalRecordId: medicalRecordId,
            rate: rate,
        });

        console.log('Created glycemia record:', glycemiaRecord);

        return glycemiaRecord;
    } catch (error) {
        console.error('Error creating glycemia record:', error);
        throw new Error('Internal server error');
    }
};

exports.getGlycemiaRecordsByPatientId = async (patientId) => {
    try {
        console.log(`Fetching glycemia records for patient ID: ${patientId}`);

        // Fetch medical record IDs for the given patient ID
        const medicalRecords = await MedicalRecord.findAll({ where: { patientId: patientId } });
        const medicalRecordIds = medicalRecords.map(record => record.id);

        console.log('Medical Record IDs:', medicalRecordIds);

        // Fetch glycemia records for the retrieved medical record IDs
        const glycemiaRecords = await Glycemia.findAll({
            where: {
                medicalRecordId: medicalRecordIds,
            },
        });

        console.log('Fetched glycemia records:', glycemiaRecords);

        return glycemiaRecords;
    } catch (error) {
        console.error('Error fetching glycemia records:', error);
        throw new Error('Internal server error');
    }
};