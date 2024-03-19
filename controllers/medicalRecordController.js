const MedicalRecord = require('../models/medicalRecord');
const moment = require('moment');


exports.createMedicalRecord = async (req, res) => {
    try {
        const { patientId, doctorId, diabetesType, hasDFU, isSmoker, hadDiabetes, bloodGroup } = req.body;

        const formattedDiabetesDate = moment(hadDiabetes).toDate();

        const medicalRecordData = {
            patientId,
            doctorId,
            diabetesType,
            hasDFU,
            isSmoker,
            hadDiabetes: formattedDiabetesDate,
            bloodGroup
        };

        const medicalRecord = await MedicalRecord.create(medicalRecordData);

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
            order: [['createdAt', 'DESC']] // Sort by createdAt in descending order
        });

        if (!medicalRecords || medicalRecords.length === 0) {
            return res.status(404).json({ status: false, message: 'Medical record not found' });
        }

        // Return the first record, which will be the latest medical record
        res.status(200).json({ status: true, medicalRecord: medicalRecords[0] });
    } catch (error) {
        console.error('Error fetching medical record:', error);
        res.status(500).json({ status: false, message: 'Internal server error' });
    }
};
