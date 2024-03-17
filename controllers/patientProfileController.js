const PatientProfile = require('../models/patientProfile');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const patientProfileService = require('../services/patientProfileService');

// Create patient's profile
exports.createPatientProfile = async (req, res) => {
    try {
        // Extract necessary information from the request body
        const { patientId, gender, height, weight, birth_date, pic } = req.body;

        // Parse the birth date using moment.js, allowing for various date formats
        const formattedBirthDate = moment(birth_date).toDate();

        // Create the patient profile using the service function
        const profileData = {
            patientId,
            gender,
            height,
            weight,
            birth_date: formattedBirthDate,
            pic
        };
        const profile = await patientProfileService.createPatientProfile(profileData);

        // Return the created profile as JSON response
        res.status(201).json(profile);
    } catch (error) {
        console.error('Error creating patient profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get patient's profile by patientId
exports.getPatientProfile = async (req, res) => {
    try {
        // Extract the patient's ID from the token if it exists
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return res.status(401).json({ status: false, message: 'Authorization header missing' });
        }
        
        const token = authorizationHeader.split(' ')[1];
        const decodedToken = jwt.verify(token, 'secret');
        const patientId = decodedToken.id;

        // Fetch the patient profile using the patientId
        const profile = await patientProfileService.getPatientProfileByPatientId(patientId);

        // Log the fetched profile data
        console.log('Fetched Profile Data:', profile);

        if (!profile) {
            return res.status(404).json({ status: false, message: 'Patient profile not found' });
        }

        res.status(200).json({ status: true, profile });
    } catch (error) {
        console.error('Error fetching patient profile:', error);
        res.status(500).json({ status: false, message: 'Internal server error' });
    }
};
