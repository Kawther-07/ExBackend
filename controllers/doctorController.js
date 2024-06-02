const Doctor = require("../models/doctor");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const DoctorServices = require("../services/doctor.service");
//const DoctorServices = require("../services/doctor.service");
const AuthServices = require("../services/auth.service");

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
    doctor = doctor.toJSON();
    const tokenData = { doctor };
    const token = await AuthServices.generateAccessToken(tokenData, process.env.JWTSecret_Key, process.env.JWT_EXPIRE);

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


// Function to fetch list of doctors
exports.getDoctorList = async (req, res) => {
  try {
    // Fetch all doctors from the database
    const doctors = await Doctor.findAll();

    // Extract only the first and last names of doctors
    const simplifiedDoctors = doctors.map(doctor => {
      return {
        first_name: doctor.first_name,
        last_name: doctor.last_name
      };
    });

    // Send the simplified list of doctors as a response
    res.status(200).json({ status: true, doctors: simplifiedDoctors });
  } catch (error) {
    console.error("Error fetching doctor list:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

// Retrieve doctor ID by name
exports.getDoctorIdByName = async (req, res) => {
  try {
    const { first_name, last_name } = req.query;

    // Find the doctor by first name and last name
    const doctor = await Doctor.findOne({
      where: { first_name, last_name },
      attributes: ['id']
    });

    if (!doctor) {
      return res.status(404).json({ status: false, message: "Doctor not found" });
    }

    res.status(200).json({ status: true, doctor_id: doctor.id });
  } catch (error) {
    console.error("Error fetching doctor ID:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

exports.getDoctors = async (req, res) => {
  try {
    const { includeArchived } = req.query;
    const condition = includeArchived === 'true' ? {} : { isArchived: false };

    const doctors = await Doctor.findAll({
      where: condition,
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
    });

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

exports.updateDoctorProfile = async (req, res) => {
  try {
    const user = req.user;
    const { doctorId } = req.params;

    // Check if the user is a doctor or an admin
    if (user.role === "doctor" || user.role === "admin") {
      let doctor;
      if (user.role === "doctor") {
        // For doctors, update their own profile
        doctor = await Doctor.findOne({ where: { id: user.doctor.id } });
      } else {
        // For admins, update the profile of the specified doctor
        doctor = await Doctor.findOne({ where: { id: doctorId } });
      }

      if (!doctor) {
        return res.status(404).json({ status: false, message: "Doctor not found" });
      }

      // Get req.body without createdAt and updatedAt fields
      const body = Object.fromEntries(Object.entries(req.body).filter(([key, value]) => key !== "createdAt" && key !== "updatedAt"));
      const updatedDoctor = await doctor.update(body);

      // Generate new JWT token with new data
      const tokenData = {
        id: doctor.id,
        email: doctor.email,
        role: user.role, // Use the role of the user who is updating the profile
        doctor: updatedDoctor.toJSON(),
      };
      const token = await AuthServices.generateAccessToken(tokenData, process.env.JWTSecret_Key, process.env.JWT_EXPIRE);

      res.status(200).json({ status: true, message: "Doctor profile updated successfully", token });
    } else {
      // If user is neither doctor nor admin, return unauthorized
      return res.status(403).json({ status: false, message: "Unauthorized" });
    }
  } catch (error) {
    console.error("Error updating doctor profile:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

exports.archiveDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { isArchived } = req.body;
    const archivedDoctor = await Doctor.archiveDoctor(doctorId, isArchived);
    res.json({ status: true, message: "Doctor archive status updated successfully", data: archivedDoctor });
  } catch (error) {
    console.error("Error updating doctor archive status:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

exports.getArchivedDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll({
      where: { isArchived: true },
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
    });

    res.json({ status: true, data: doctors });
  } catch (error) {
    console.error("Error fetching archived doctors:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};
