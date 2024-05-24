// const MedicalRecord = require('../models/medicalRecord');
const moment = require('moment');
// const medicalRecordService = require('../services/medicalRecordService');

// exports.createMedicalRecord = async (req, res) => {
//     try {
//         console.log('Incoming request body:', req.body); // Logging incoming data for debugging

//         const { patientId, doctorId, diabetesType, hasDFU, isSmoker, hadDiabetes, bloodGroup } = req.body;

//         // Ensure doctorId is present and valid
//         if (!doctorId || isNaN(doctorId)) {
//             return res.status(400).json({ error: 'Invalid doctorId' });
//         }

//         // Ensure patientId is an integer
//         if (isNaN(patientId)) {
//             return res.status(400).json({ error: 'Invalid patientId' });
//         }

//         // Create new medical record
//         const medicalRecord = await MedicalRecord.create({
//             patientId,
//             doctorId: parseInt(doctorId), // Convert doctorId to integer if necessary
//             diabetesType,
//             hasDFU,
//             isSmoker,
//             hadDiabetes,
//             bloodGroup: bloodGroup || null,
//         });

//         res.status(201).json(medicalRecord);
//     } catch (error) {
//         console.error('Error creating medical record:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };


// exports.getMedicalRecord = async (req, res) => {
//     try {
//         const { patientId } = req.params;

//         const medicalRecords = await MedicalRecord.findAll({ 
//             where: { patientId },
//             order: [['createdAt', 'DESC']] // Sort by createdAt in descending order
//         });

//         if (!medicalRecords || medicalRecords.length === 0) {
//             return res.status(404).json({ status: false, message: 'Medical record not found' });
//         }

//         // Return the first record, which will be the latest medical record
//         res.status(200).json({ status: true, medicalRecord: medicalRecords[0] });
//     } catch (error) {
//         console.error('Error fetching medical record:', error);
//         res.status(500).json({ status: false, message: 'Internal server error' });
//     }
// };


// // Update patient's profile
// exports.updateMedicalRecord = async (req, res) => {
//     try {
//         console.log('Incoming request body:', req.body); // Logging incoming data for debugging

//         const { doctorId, diabetesType, hasDFU, isSmoker, hadDiabetes, bloodGroup } = req.body;
//         const patientId = req.params.patientId;

//         const latestMedicalRecord = await medicalRecordService.findLatestMedicalRecord(patientId);

//         if (!latestMedicalRecord) {
//             return res.status(404).json({ error: 'Latest medical profile not found' });
//         }

//         // Update fields if they are provided in the request body and not undefined
//         if (doctorId !== undefined) {
//             latestMedicalRecord.doctorId = doctorId;
//         }
//         if (diabetesType !== undefined) {
//             latestMedicalRecord.diabetesType = diabetesType;
//         }
//         if (hasDFU !== undefined) {
//             latestMedicalRecord.hasDFU = hasDFU;
//         }
//         if (isSmoker !== undefined) {
//             latestMedicalRecord.isSmoker = isSmoker;
//         }
//         if (hadDiabetes !== undefined && hadDiabetes !== null) {
//             latestMedicalRecord.hadDiabetes = hadDiabetes;
//         }
//         if (bloodGroup !== undefined) {
//             latestMedicalRecord.bloodGroup = bloodGroup;
//         }

//         // Save the updated profile
//         await latestMedicalRecord.save();

//         res.status(200).json({ status: true, message: 'Medical profile updated successfully' });
//     } catch (error) {
//         console.error('Error updating medical profile:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };


const MedicalRecord = require('../models/medicalRecord');
const medicalRecordService = require('../services/medicalRecordService');

exports.createMedicalRecord = async (req, res) => {
    try {
        const { patientId, doctorId, diabetesType, hasDFU, isSmoker, hadDiabetes, bloodGroup } = req.body;

        if (!doctorId || isNaN(doctorId)) {
            return res.status(400).json({ error: 'Invalid doctorId' });
        }
        if (isNaN(patientId)) {
            return res.status(400).json({ error: 'Invalid patientId' });
        }

        const medicalRecord = await MedicalRecord.create({
            patientId,
            doctorId: parseInt(doctorId),
            diabetesType,
            hasDFU,
            isSmoker,
            hadDiabetes,
            bloodGroup: bloodGroup || null,
        });

        res.status(201).json(medicalRecord);
    } catch (error) {
        console.error('Error creating medical record:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getMedicalRecord = async (req, res) => {
    try {
        const { patientId } = req.params;
        const medicalRecords = await MedicalRecord.findAll({
            where: { patientId },
            order: [['createdAt', 'DESC']]
        });

        if (!medicalRecords || medicalRecords.length === 0) {
            return res.status(404).json({ status: false, message: 'Medical record not found' });
        }

        res.status(200).json({ status: true, medicalRecord: medicalRecords[0] });
    } catch (error) {
        console.error('Error fetching medical record:', error);
        res.status(500).json({ status: false, message: 'Internal server error' });
    }
};

// Update the `updateMedicalRecord` function to ensure correct updating
// Update the `updateMedicalRecord` function to ensure correct updating
exports.updateMedicalRecord = async (req, res) => {
    try {
        const { doctorId, diabetesType, hasDFU, isSmoker, hadDiabetes, bloodGroup } = req.body;
        const { medicalRecordId } = req.params;

        // Validate medicalRecordId if necessary
        if (!medicalRecordId || isNaN(medicalRecordId)) {
            return res.status(400).json({ error: 'Invalid medicalRecordId' });
        }

        // Find the latest medical record for the patient
        const latestMedicalRecord = await medicalRecordService.findLatestMedicalRecordByPatientId(medicalRecordId);

        if (!latestMedicalRecord || latestMedicalRecord.id != medicalRecordId) {
            return res.status(404).json({ error: 'Medical record not found or not the latest' });
        }

        // Update the medical record attributes
        latestMedicalRecord.doctorId = doctorId ? parseInt(doctorId) : latestMedicalRecord.doctorId;
        latestMedicalRecord.diabetesType = diabetesType !== undefined ? diabetesType : latestMedicalRecord.diabetesType;
        latestMedicalRecord.hasDFU = hasDFU !== undefined ? hasDFU : latestMedicalRecord.hasDFU;
        latestMedicalRecord.isSmoker = isSmoker !== undefined ? isSmoker : latestMedicalRecord.isSmoker;
        latestMedicalRecord.hadDiabetes = hadDiabetes !== undefined ? hadDiabetes : latestMedicalRecord.hadDiabetes;
        latestMedicalRecord.bloodGroup = bloodGroup !== undefined ? bloodGroup : latestMedicalRecord.bloodGroup;

        // Save the updated medical record
        await latestMedicalRecord.save();

        // Respond with success message
        res.status(200).json({ status: true, message: 'Medical record updated successfully' });
    } catch (error) {
        console.error('Error updating medical record:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};