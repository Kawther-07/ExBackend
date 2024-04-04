const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Patient = require("../models/patient");

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

  static async getUserEmailById(patientId) {
    try {
      // Retrieve patient by ID
      const patient = await Patient.findByPk(patientId);
      // Return the patient's email
      return patient.email;
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
            throw new Error("Patient not found");
        }

        // Update patient's password with the new password
        patient.password = newPassword;

        // Save the changes
        await patient.save();

        // Return true indicating success
        return true;
    } catch (error) {
        throw error; // Propagate error to caller
    }
}

}

module.exports = PatientServices;
