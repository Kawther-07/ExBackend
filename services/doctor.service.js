const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Doctor = require("../models/doctor");

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

  static validatePhone(phone) {
    if (phone) {
      const phoneRegex = /^(06|05|07)\d{8}$/;
      if (!phoneRegex.test(phone.toString())) {
        return {
          status: false,
          message: "Phone number must start with 06, 05 or 07 and be 10 digits long.",
        };
      }
    }
    return {
      status: true,
    };
  }
}

module.exports = DoctorServices;
