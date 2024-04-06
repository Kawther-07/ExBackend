const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
const Doctor = require("../models/doctor");

class AuthServices {
  static async generateAccessToken(tokenData, JWTSecret_Key, JWT_EXPIRE) {
    return jwt.sign(tokenData, JWTSecret_Key, { expiresIn: JWT_EXPIRE });
  }

  static async checkAdminAndDoctor(email) {
    try {
      const doctor = await Doctor.findOne({ where: { email } });
      if (!doctor) {
        const admin = await Admin.findOne({ where: { email } });
        if (!admin) {
          return null;
        }
        return admin;
      }
      return doctor;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AuthServices;
