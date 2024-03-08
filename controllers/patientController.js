const Patient = require('../models/patient');
const bcrypt = require('bcrypt');

// Create an patient
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


// Log in the patient
exports.loginPatient = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Retrieve patient by email
        const patient = await Patient.findOne({ where: { email } });
        if (!patient) {
            return res.status(404).json({ status: false, message: 'Patient does not exist' });
        }

        // Compare passwords
        const isPasswordCorrect = await bcrypt.compare(password, patient.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ status: false, message: 'Incorrect patient name or password' });
        }

        res.status(200).json({ status: true, message: 'Successfully logged in', id: patient.id });
    } catch (error) {
        console.error('Error logging in patient:', error);
        res.status(500).json({ status: false, message: 'Internal server error' });
    }
};
