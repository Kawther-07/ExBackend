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

module.exports = AdminServices;
