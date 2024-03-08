const Doctor = require('../models/doctor');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const DoctorServices = require('../services/doctor.service');

// Create an doctor
exports.createDoctor = async (req, res) => {
    try {
        const { first_name, last_name, email, phone, password, role } = req.body;
        
        // Check if v with the same email already exists
        const existingDoctor = await Doctor.findOne({ where: { email } });
        if (existingDoctor) {
            return res.status(400).json({ status: false, message: `The email ${email} is already registered` });
        }
        
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new doctor with hashed password
        const doctor = await Doctor.create({ first_name, last_name, email, phone, password: hashedPassword, role });
        res.json({ status: true, message: 'Doctor registered successfully', id: doctor.id });
    } catch (error) {
        console.error('Error creating doctor:', error);
        res.status(500).json({ status: false, message:  'Internal server error' });
    }
};


// Log in the doctor
exports.loginDoctor = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ status: false, message: 'Invalid parameters' });
        }

        // Retrieve doctor by email
        let doctor = await DoctorServices.checkDoctor(email);
        if (!doctor) {
            return res.status(404).json({ status: false, message: 'Doctor does not exist' });
        }

        // Compare passwords
        const isPasswordCorrect = await bcrypt.compare(password, doctor.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ status: false, message: 'Invalid doctor name or password' });
        }

        // Generate JWT token
        const tokenData = { id: doctor.id, email: doctor.email }; 
        const token = await DoctorServices.generateAccessToken(tokenData, "secret", "1h")

        res.status(200).json({ status: true, success: "Successfully logged in", token, name: doctor.first_name });
    } catch (error) {
        console.error('Error logging in doctor:', error);
        res.status(500).json({ status: false, message: 'Internal server error' });
    }
};