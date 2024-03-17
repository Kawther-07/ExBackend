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
}

module.exports = PatientServices;
