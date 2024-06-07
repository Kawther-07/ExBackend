const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
const Doctor = require("../models/doctor");


class AuthServices {
  static async generateAccessToken(tokenData) {
    if (tokenData?.password) {
      delete tokenData.password;
    }
    if (tokenData?.admin?.password) {
      delete tokenData.admin.password;
    }
    if (tokenData?.doctor?.password) {
      delete tokenData.doctor.password;
    }

    const JWTSecret_Key = process.env.JWTSecret_Key;
    const JWT_EXPIRE = process.env.JWT_EXPIRE;

    if (!JWTSecret_Key) {
      throw new Error("JWTSecret_Key is not defined");
    }

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

  static async resetAdminDoctorsPassword(email, newPassword) {
    try {
        // Find the patient by email
        let user = null;
        const doctor = await Doctor.findOne({ where: { email } });
        if(!doctor) {
          const admin = await Admin.findOne({ where: { email } });
          if(!admin) {
            throw new Error("User not found");
          }else {
            user = admin;
          }
        } else {
          user = doctor;
        }

        // Update user password with the new password
        user.password = newPassword;

        // Save the changes
        await user.save();

        // Return true indicating success
        return true;
    } catch (error) {
        throw error; // Propagate error to caller
    }
  }
}

module.exports = AuthServices;