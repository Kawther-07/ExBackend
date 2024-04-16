const Doctor = require("../models/doctor");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const DoctorServices = require("../services/doctor.service");

// Create doctor
exports.createDoctor = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, password, role, speciality, address, bio, profilePicture, document } = req.body;

    // Check if doctor with the same email already exists
    const existingDoctor = await Doctor.findOne({ where: { email } });
    if (existingDoctor) {
      return res.status(400).json({ status: false, message: `The email ${email} is already registered` });
    }

    // Create new doctor with hashed password
    const doctor = await Doctor.create({
      first_name,
      last_name,
      email,
      phone,
      password,
      role,
      speciality,
      address,
      profilePicture,
      document,
      bio: bio || "",
    });
    res.json({ status: true, message: "Doctor registered successfully", id: doctor.id });
  } catch (error) {
    console.error("Error creating doctor:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

// Login doctor
exports.loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: false, message: "Invalid parameters" });
    }

    // Retrieve doctor by email
    let doctor = await DoctorServices.checkDoctor(email);
    if (!doctor) {
      return res.status(404).json({ status: false, message: "Doctor does not exist" });
    }

    // Compare passwords
    const isPasswordCorrect = await bcrypt.compare(password, doctor.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ status: false, message: "Invalid doctor name or password" });
    }

    // Generate JWT token
    const tokenData = { id: doctor.id, email: doctor.email };
    const token = await DoctorServices.generateAccessToken(tokenData, "secret", "24h");

    res.status(200).json({ status: true, success: "Successfully logged in", token, doctor });
  } catch (error) {
    console.error("Error logging in doctor:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

// Logout doctor ----not final
exports.logoutDoctor = async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(400).json({ status: false, message: "Token not provided" });
    }

    return res.status(200).json({ status: true, message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

// Doctor profile
exports.getDoctorProfile = async (req, res) => {
  try {
    const { email } = req.query;
    // Retrieve doctor by email
    const doctor = await Doctor.findOne({ where: { email } });

    if (!doctor) {
      return res.status(404).json({ status: false, message: "Doctor not found" });
    }

    // Exclude the password field from the doctor object
    const { password, ...doctorWithoutPassword } = doctor.toJSON();

    // Return doctor profile without the password
    res.status(200).json({ status: true, doctor: doctorWithoutPassword });
  } catch (error) {
    console.error("Error fetching doctor profile:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll({ attributes: { exclude: ["password"] } });
    res.json({ status: true, data: doctors });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const doctor = await Doctor.findOne({
      where: { id: doctorId },
      attributes: { exclude: ["password"] },
    });
    if (!doctor) {
      return res.status(404).json({ status: false, message: "Doctor not found" });
    }
    res.json({ status: true, data: doctor });
  } catch (error) {
    console.error("Error fetching doctor:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};
