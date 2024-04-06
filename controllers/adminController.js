const Admin = require("../models/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const AdminServices = require("../services/admin.service");

// Create admin
exports.createAdmin = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, password, role } = req.body;

    // Check if admin with the same email already exists
    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin) {
      return res.status(400).json({ status: false, message: `The email ${email} is already registered` });
    }

    // Create new admin with hashed password
    const admin = await Admin.create({ first_name, last_name, email, phone, password, role });
    res.json({ status: true, message: "Admin registered successfully", id: admin.id });
  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

// Login admin
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: false, message: "Invalid parameters" });
    }

    // Retrieve admin by email
    let admin = await AdminServices.checkAdmin(email);
    if (!admin) {
      return res.status(404).json({ status: false, message: "Admin does not exist" });
    }

    // Compare passwords
    const isPasswordCorrect = await bcrypt.compare(password, admin.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ status: false, message: "Invalid administrator name or password" });
    }

    // Generate JWT token
    const tokenData = { id: admin.id, email: admin.email }; // Customize token payload as needed
    const token = await AdminServices.generateAccessToken(tokenData, "secret", "24h");

    res.status(200).json({ status: true, success: "Successfully logged in", token, name: admin.first_name });
  } catch (error) {
    console.error("Error logging in admin:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

// Logout admin ----- Not final
exports.logoutAdmin = async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(400).json({ status: false, message: "Token not provided" });
    }

    // Return success response
    return res.status(200).json({ status: true, message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

// Admin profile
exports.getAdminProfile = async (req, res) => {
  try {
    const { email } = req.query;

    // Retrieve admin by email
    const admin = await Admin.findOne({ where: { email } });

    if (!admin) {
      return res.status(404).json({ status: false, message: "Admin not found" });
    }

    // Exclude the password field from the admin object
    const { password, ...adminWithoutPassword } = admin.toJSON();

    // Return admin profile without the password
    res.status(200).json({ status: true, admin: adminWithoutPassword });
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};
