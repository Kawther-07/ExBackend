const patientProfileService = require('../models/patientProfile');

exports.createPatientProfile = async (data) => {
    try {
        const profile = await patientProfileService.create(data);
        return profile;
    } catch (error) {
        console.error('Error creating patient profile:', error);
        throw new Error('Internal server error');
    }
};

exports.getPatientProfileByPatientId = async (patientId) => {
    try {
        const profile = await patientProfileService.findOne({ where: { patientId } });
        return profile;
    } catch (error) {
        console.error('Error fetching patient profile:', error);
        throw new Error('Internal server error');
    }
};
