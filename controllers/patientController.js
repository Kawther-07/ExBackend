const Patient = require('../models/patient');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const PatientServices = require('../services/patient.service');

// Create patient
exports.createPatient = async (req, res) => {
    try {
        const { first_name, last_name, email, phone, password, age, height, weight, gender, role } = req.body;
        
        // Check if v with the same email already exists
        const existingPatient = await Patient.findOne({ where: { email } });
        if (existingPatient) {
            return res.status(400).json({ status: false, message: `The email ${email} is already registered` });
        }
        
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new patient with hashed password
        const patient = await Patient.create({ first_name, last_name, email, phone, password: hashedPassword, age, height, weight, gender, role });
        res.json({ status: true, message: 'Patient registered successfully', id: patient.id });
    } catch (error) {
        console.error('Error creating patient:', error);
        res.status(500).json({ status: false, message:  'Internal server error' });
    }
};


// Login patient
exports.loginPatient = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ status: false, message: 'Invalid parameters' });
        }

        // Retrieve patient by email
        let patient = await PatientServices.checkPatient(email);
        if (!patient) {
            return res.status(404).json({ status: false, message: 'Patient does not exist' });
        }

        // Compare passwords
        const isPasswordCorrect = await bcrypt.compare(password, patient.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ status: false, message: 'Invalid patient name or password' });
        }

        // Generate JWT token
        const tokenData = { id: patient.id, email: patient.email }; 
        const token = await PatientServices.generateAccessToken(tokenData, "secret", "1h")

        res.status(200).json({ status: true, success: "Successfully logged in", token, name: patient.first_name });
    } catch (error) {
        console.error('Error logging in patient:', error);
        res.status(500).json({ status: false, message: 'Internal server error' });
    }
};

// Lougout patient
exports.logoutPatient = async (req, res) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(400).json({ status: false, message: 'Token not provided' });
        }

        // You can perform any additional validation here if needed

        // Return success response
        return res.status(200).json({ status: true, message: 'Logout successful' });
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ status: false, message: 'Internal server error' });
    }
};
