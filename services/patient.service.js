const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Patient = require('../models/patient');

class PatientServices {
    static async registerPatient(first_name, last_name, email, phone, password) {
        try {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);

            const patient = await Patient.create({ first_name, last_name, email, phone, password: hash });

            return patient;
        } catch (error) {
            throw error;
        }
    }

    static async getPatientByEmail(email) {
        try {
            const patient = await Patient.findOne({ where: { email } });
            return patient;
        } catch (error) {
            throw error;
        }
    }

    static async checkPatient(email) {
        try {
            const patient = await Patient.findOne({ where: { email } });
            return patient;
        } catch (error) {
            throw error;
        }
    }

    static async generateAccessToken(tokenData, JWTSecret_Key, JWT_EXPIRE) {
        return jwt.sign(tokenData, JWTSecret_Key, { expiresIn: JWT_EXPIRE });
    }

    static async resetPatientPassword(email, newPassword) {
        try {
            // Find the patient by email
            const patient = await Patient.findOne({ where: { email } });
    
            // If patient not found, throw an error
            if (!patient) {
                throw new Error('Patient not found');
            }
    
            // Temporarily remove the phone number from the patient object
            const { phone, id } = patient; // Store patient's ID
            delete patient.phone;
    
            // Hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);
    
            // Update patient's password without triggering phone number validation
            await patient.update({ password: hashedPassword });
    
            // Restore the phone number
            if (phone) {
                patient.phone = phone;
                await patient.save();
            }
    
            // Return patient's ID along with the email
            return { id, email }; // Return an object with patient's ID and email
        } catch (error) {
            throw error;
        }
    }
    
}


module.exports = PatientServices;
