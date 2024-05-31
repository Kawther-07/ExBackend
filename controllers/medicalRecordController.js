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



// Didn't change anything in here, let's ines test it first
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
        const medicalRecord = await medicalRecordService.findLatestMedicalRecordByPatientId(patientId);

        if (!medicalRecord) {
            return res.status(404).json({ status: false, message: 'Medical record not found' });
        }

        res.status(200).json({ status: true, medicalRecord });
    } catch (error) {
        console.error('Error fetching medical record:', error);
        res.status(500).json({ status: false, message: 'Internal server error' });
    }
};

exports.getMedicalRecordIdByPatientId = async (req, res) => {
    const { patientId } = req.params;

    try {
        const medicalRecord = await MedicalRecord.findOne({
            where: { patientId },
            attributes: ['id'] // Return 'id' as medicalRecordId
        });

        if (!medicalRecord) {
            return res.status(404).json({ error: 'Medical record not found' });
        }

        res.status(200).json({ medicalRecordId: medicalRecord.id }); // Return 'id' as medicalRecordId
    } catch (error) {
        console.error('Error fetching medical record ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update the `updateMedicalRecord` function to ensure correct updating
// Update the `updateMedicalRecord` function to ensure correct updating
// exports.updateMedicalRecord = async (req, res) => {
//     const { medicalRecordId } = req.params;
//     const { patientId, doctorId, diabetesType, hasDFU, isSmoker, hadDiabetes, bloodGroup } = req.body;
    
//     try {
//       // Find the medical record by ID
//       let medicalRecord = await MedicalRecord.findByPk(medicalRecordId);
    
//       if (!medicalRecord) {
//         return res.status(404).json({ error: 'Medical record not found' });
//       }
    
//       // Update fields if provided
//       if (patientId) medicalRecord.patientId = patientId;
//       if (doctorId) medicalRecord.doctorId = doctorId;
//       if (diabetesType) medicalRecord.diabetesType = diabetesType;
//       if (hasDFU !== undefined) medicalRecord.hasDFU = hasDFU;
//       if (isSmoker !== undefined) medicalRecord.isSmoker = isSmoker;
//       if (hadDiabetes) medicalRecord.hadDiabetes = hadDiabetes;
//       if (bloodGroup) medicalRecord.bloodGroup = bloodGroup;
    
//       // Save the updated record
//       await medicalRecord.save();
    
//       res.status(200).json({ message: 'Medical record updated successfully', medicalRecord });
//     } catch (error) {
//       console.error('Error updating medical record:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   };


// exports.updateMedicalRecord = async (req, res) => {
//     try {
//         const { medicalRecordId } = req.params;
//         const { patientId, doctorId, diabetesType, hasDFU, isSmoker, hadDiabetes, bloodGroup } = req.body;

//         const medicalRecord = await MedicalRecord.findByPk(medicalRecordId);

//         if (!medicalRecord) {
//             return res.status(404).json({ error: 'Medical record not found' });
//         }

//         // Update fields if they are provided in the request body and not undefined
//         if (patientId !== undefined) {
//             medicalRecord.patientId = patientId;
//         }
//         if (doctorId !== undefined) {
//             medicalRecord.doctorId = doctorId;
//         }
//         if (diabetesType !== undefined) {
//             medicalRecord.diabetesType = diabetesType;
//         }
//         if (hasDFU !== undefined) {
//             medicalRecord.hasDFU = hasDFU;
//         }
//         if (isSmoker !== undefined) {
//             medicalRecord.isSmoker = isSmoker;
//         }
//         if (hadDiabetes !== undefined && hadDiabetes !== null) {
//             medicalRecord.hadDiabetes = hadDiabetes;
//         }
//         if (bloodGroup !== undefined) {
//             medicalRecord.bloodGroup = bloodGroup;
//         }

//         // Save the updated medical record
//         await medicalRecord.save();

//         res.status(200).json({ message: 'Medical record updated successfully', medicalRecord });
//     } catch (error) {
//         console.error('Error updating medical record:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

exports.updateMedicalRecordByPatientId = async (req, res) => {
    const { patientId } = req.params;
    const { doctorId, diabetesType, hasDFU, isSmoker, hadDiabetes, bloodGroup } = req.body;

    console.log('Received update request for patientId:', patientId);
    console.log('Request body:', req.body);

    try {
        // Find the latest medical record by patientId
        let medicalRecord = await medicalRecordService.findLatestMedicalRecordByPatientId(patientId);

        if (!medicalRecord) {
            console.error('Medical record not found');
            return res.status(404).json({ error: 'Medical record not found' });
        }

        // Update fields if provided
        if (doctorId !== undefined) medicalRecord.doctorId = doctorId;
        if (diabetesType !== undefined) medicalRecord.diabetesType = diabetesType;
        if (hasDFU !== undefined) medicalRecord.hasDFU = hasDFU;
        if (isSmoker !== undefined) medicalRecord.isSmoker = isSmoker;
        if (hadDiabetes !== undefined) medicalRecord.hadDiabetes = hadDiabetes;
        if (bloodGroup !== undefined) medicalRecord.bloodGroup = bloodGroup;

        console.log('Updated medical record:', medicalRecord);

        // Save the updated record
        await medicalRecord.save();

        res.status(200).json({ message: 'Medical record updated successfully', medicalRecord });
    } catch (error) {
        console.error('Error updating medical record:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
