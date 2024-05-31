const Glycemia = require('../models/glycemia');
const MedicalRecord = require('../models/medicalRecord');


exports.createGlycemiaRecord = async (medicalRecordId, rate) => {
    try {
        console.log(`Creating glycemia record for Medical Record ID: ${medicalRecordId}, Rate: ${rate}`);

        // Check if the medical record exists
        const medicalRecord = await MedicalRecord.findByPk(medicalRecordId);
        if (!medicalRecord) {
            throw new Error('Medical record not found');
        }

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

exports.getGlycemiaRecordsByPatientIdAndDateRange = async (patientId, startDate, endDate) => {
    try {
        console.log(`Fetching glycemia records for patient ID: ${patientId} between ${startDate} and ${endDate}`);

        // Fetch medical record IDs for the given patient ID
        const medicalRecords = await MedicalRecord.findAll({ where: { patientId: patientId } });
        const medicalRecordIds = medicalRecords.map(record => record.id);

        console.log('Medical Record IDs:', medicalRecordIds);

        // Fetch glycemia records for the retrieved medical record IDs within the date range
        const glycemiaRecords = await Glycemia.findAll({
            where: {
                medicalRecordId: medicalRecordIds,
                createdAt: {
                    [Op.between]: [startDate, endDate]
                }
            },
        });

        console.log('Fetched glycemia records:', glycemiaRecords);

        return glycemiaRecords;
    } catch (error) {
        console.error('Error fetching glycemia records:', error);
        throw new Error('Internal server error');
    }
};