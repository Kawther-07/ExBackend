const Admin = require("../models/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const AdminServices = require("../services/admin.service");
const AuthServices = require("../services/auth.service");

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

    admin = admin.toJSON();
    // Generate JWT token
    const tokenData = { admin }; // Customize token payload as needed
    const token = await AuthServices.generateAccessToken(tokenData, "secret", "24h");

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

exports.updateAdminProfile = async (req, res) => {
  try {
    const user = req.user; // Assuming you have authentication middleware that sets the user object
    if (user.role !== "admin") {
      return res.status(403).json({ status: false, message: "Unauthorized access" });
    }

    const { adminId } = req.params; // Assuming you have adminId as a parameter in your route

    const admin = await Admin.findOne({ where: { id: adminId } });
    if (!admin) {
      return res.status(404).json({ status: false, message: "Admin not found" });
    }

    // Update only the fields that were passed in the request body.
    const body = Object.fromEntries(Object.entries(req.body).filter(([key, value]) => key !== "createdAt" && key !== "updatedAt"));
    await admin.update(body);

    // Optionally, generate a new JWT token with updated data
    const tokenData = {
      id: admin.id,
      email: admin.email,
      role: admin.role,
      // Add any additional data you want to include in the token
    };
    const token = await AuthServices.generateAccessToken(tokenData, process.env.JWT_SECRET, "24h");

    res.status(200).json({ status: true, message: "Admin profile updated successfully", token });
  } catch (error) {
    console.error("Error updating admin profile:", error.message, error.stack);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};


