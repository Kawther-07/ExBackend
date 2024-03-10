const MedicalRecord = require('../models/medicalRecord');

class MedicalRecordService {
    static async createMedicalRecord(patientId, diabetesType, hasDFU, isSmoker, glycemia, diab_duration, age, height, weight, gender) {
        try {
            const medicalRecord = await MedicalRecord.create({
                patientId,
                diabetesType,
                hasDFU,
                isSmoker,
                glycemia,
                diab_duration,
                age,
                height,
                weight,
                gender
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
