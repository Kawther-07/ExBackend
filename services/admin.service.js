const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");

class AdminServices {
  static async registerAdmin(first_name, last_name, email, phone, password, role) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const admin = await Admin.create({ first_name, last_name, email, phone, password: hash, role });

      return admin;
    } catch (error) {
      throw error;
    }
  }

  static async getAdminByEmail(email) {
    try {
      const admin = await Admin.findOne({ where: { email } });
      return admin;
    } catch (error) {
      throw error;
    }
  }

  static async checkAdmin(email) {
    try {
      const admin = await Admin.findOne({ where: { email } });
      return admin;
    } catch (error) {
      throw error;
    }
  }

  static async generateAccessToken(tokenData, JWTSecret_Key, JWT_EXPIRE) {
    return jwt.sign(tokenData, JWTSecret_Key, { expiresIn: JWT_EXPIRE });
  }
}

module.exports = AdminServices;
