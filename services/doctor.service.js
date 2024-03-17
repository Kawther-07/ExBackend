const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Doctor = require('../models/doctor');

class DoctorServices {
    static async registerDoctor(first_name, last_name, email, phone, password, role, specialty, address) {
        try {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);

            const doctor = await Doctor.create({ first_name, last_name, email, phone, password: hash, role, specialty, address });

            return doctor;
        } catch (error) {
            throw error;
        }
    }

    static async getDoctorByEmail(email) {
        try {
            const doctor = await Doctor.findOne({ where: { email } });
            return doctor;
        } catch (error) {
            throw error;
        }
    }

    static async checkDoctor(email) {
        try {
            const doctor = await Doctor.findOne({ where: { email } });
            return doctor;
        } catch (error) {
            throw error;
        }
    }

    static async generateAccessToken(tokenData, JWTSecret_Key, JWT_EXPIRE) {
        return jwt.sign(tokenData, JWTSecret_Key, { expiresIn: JWT_EXPIRE });
    }
}

module.exports = DoctorServices;
