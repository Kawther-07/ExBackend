const Glycemia = require('../models/glycemia');

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
