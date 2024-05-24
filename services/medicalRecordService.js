// const MedicalRecord = require('../models/medicalRecord');

// exports.createMedicalRecord = async (data) => {
//     try {
//         const record = await MedicalRecord.create(data);
//         return record;
//     } catch (error) {
//         console.error('Error creating medical record:', error);
//         throw new Error('Internal server error');
//     }
// };

// exports.getMedicalRecordByPatientId = async (patientId) => {
//     try {
//         const record = await MedicalRecord.findOne({ where: { patientId } });
//         return record;
//     } catch (error) {
//         console.error('Error fetching medical record:', error);
//         throw new Error('Internal server error');
//     }
// };

// exports.findLatestMedicalRecord = async (patientId) => {
//     try {
//         const latestMedicalRecord = await MedicalRecordService.findOne({
//             where: { patientId },
//             order: [['createdAt', 'DESC']] // Order by createdAt in descending order
//         });
//         return latestMedicalRecord;
//     } catch (error) {
//         console.error('Error finding latest medical profile:', error);
//         throw new Error('Internal server error');
//     }
// };


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

exports.findLatestMedicalRecordByPatientId = async (patientId) => {
    try {
        const latestMedicalRecord = await MedicalRecord.findOne({
            where: { patientId },
            order: [['createdAt', 'DESC']]
        });
        return latestMedicalRecord;
    } catch (error) {
        console.error('Error finding latest medical record:', error);
        throw new Error('Internal server error');
    }
};