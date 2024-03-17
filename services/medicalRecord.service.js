const MedicalRecord = require('../models/medicalRecord');

class MedicalRecordService {
    static async createMedicalRecord(patientId, doctorId, diabetesType, hasDFU, isSmoker, hadDiabetes, bloodGroup) {
        try {
            const medicalRecord = await MedicalRecord.create({
                patientId,
                doctorId,
                diabetesType,
                hasDFU,
                isSmoker,
                hadDiabetes,
                bloodGroup
            });
            return medicalRecord;
        } catch (error) {
            throw error;
        }
    }

    static async getMedicalRecordByPatientId(patientId) {
        try {
            const medicalRecord = await MedicalRecord.findAll({ 
                where: { patientId },
                attributes: {
                    exclude: ['id']
                }
            });
            return medicalRecord;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = MedicalRecordService;
