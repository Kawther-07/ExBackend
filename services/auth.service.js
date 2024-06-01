const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
const Doctor = require("../models/doctor");

class AuthServices {
  static async generateAccessToken(tokenData, JWTSecret_Key, JWT_EXPIRE) {
    if (tokenData?.password) {
      delete tokenData.password;
    }
    if (tokenData?.admin?.password) {
      delete tokenData.admin.password;
    }
    if (tokenData?.doctor?.password) {
      delete tokenData.doctor.password;
    }
    console.log("tokenData: ", tokenData);
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