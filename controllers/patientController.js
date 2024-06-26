const { Patient, Doctor, MedicalRecord, PatientPersonalProfile } = require("../models/associations"); // Adjust the path as necessary
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const PatientServices = require("../services/patient.service");
// const MedicalRecordService = require('../services/medicalRecordService');
const AuthServices = require("../services/auth.service");

// Create patient
exports.createPatient = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, password, selected_doctor } = req.body;
    console.log("recieved data:", req.body);
    // Check if patient with the same email already exists
    const existingPatient = await Patient.findOne({ where: { email } });
    if (existingPatient) {
      return res.status(400).json({ status: false, message: `The email ${email} is already registered` });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new patient with hashed password and doctorId
    const patient = await Patient.create({
      first_name,
      last_name,
      email,
      phone,
      password: hashedPassword,
      doctorid: selected_doctor || null, // Ensure this matches your database column name
    });

    // Generate JWT token
    const tokenData = { id: patient.id, email: patient.email };
    const token = await AuthServices.generateAccessToken(tokenData, process.env.JWTSecret_Key, process.env.JWT_EXPIRE);

    res.json({ status: true, message: "Patient registered successfully", id: patient.id, doctorId: patient.doctorid, token });
  } catch (error) {
    console.error("Error creating patient:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

// Login patient
exports.loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the patient exists
    const patient = await Patient.findOne({ where: { email }, include: [{ model: Doctor, as: 'doctor' }] });
    if (!patient) {
      return res.status(400).json({ status: false, message: "Invalid email or password" });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) {
      return res.status(400).json({ status: false, message: "Invalid email or password" });
    }

    // Generate JWT token
    const tokenData = { id: patient.id, email: patient.email };
    const token = await AuthServices.generateAccessToken(tokenData, process.env.JWTSecret_Key, process.env.JWT_EXPIRE);

    // Retrieve doctor ID if exists
    const doctorId = patient.doctor ? patient.doctor.id : null;

    res.json({ 
      status: true, 
      message: "Successfully logged in", 
      token, 
      id: patient.id, 
      doctorId, 
      name: `${patient.first_name} ${patient.last_name}` 
    });
  } catch (error) {
    console.error("Error logging in patient:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};




// Lougout patient ----FINALE
exports.logoutPatient = async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(400).json({ status: false, message: "Token not provided" });
    }

    res.clearCookie("token");

    return res.status(200).json({ status: true, message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

exports.getPatientProfile = async (req, res) => {
  try {
    const { patientId } = req.params;
    console.log("Received patient ID:", patientId);

    // Retrieve patient profile data based on patient ID
    const profileData = await PatientServices.getPatientProfile(patientId);
    console.log("Retrieved profile data:", profileData);

    if (!profileData) {
      return res.status(404).json({ status: false, message: "Profile data not found" });
    }

    // Retrieve patient's email by patientId
    const userEmail = await PatientServices.getUserEmailById(patientId);
    // Combine profile data with email address
    const patientProfile = { ...profileData, email: userEmail };

    res.json({ status: true, profile: patientProfile });
  } catch (error) {
    console.error("Error fetching patient profile:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};


exports.getPatientNameById = async (req, res) => {
  try {
    const { patientId } = req.params;

    // Retrieve patient by ID
    const patient = await Patient.findByPk(patientId);

    // If patient not found, return 404
    if (!patient) {
      return res.status(404).json({ status: false, message: "Patient not found" });
    }

    // Extract and return patient's name
    const patientName = `${patient.first_name} ${patient.last_name}`;
    res.json({ status: true, patientName });
  } catch (error) {
    console.error("Error fetching patient name:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

// Patient profile
// exports.getPatientProfile = async (req, res) => {
//     try {
//         const { email } = req.query; // Assuming you want to fetch the profile by email

//         // Retrieve patient by email
//         const patient = await Patient.findOne({ email });

//         if (!patient) {
//             return res.status(404).json({ status: false, message: 'Patient not found' });
//         }

//         // Exclude the password field from the patient object
//         const { password, ...patientWithoutPassword } = patient.toJSON();

//         // Return patient profile without the password
//         res.status(200).json({ status: true, patient: patientWithoutPassword });
//     } catch (error) {
//         console.error('Error fetching patient profile:', error);
//         res.status(500).json({ status: false, message: 'Internal server error' });
//     }
// };

// exports.getPatientProfile = async (req, res) => {
//     try {
//         const { email } = req.query;

//         const patient = await Patient.findOne({ email });
//         if (!patient) {
//             return res.status(404).json({ status: false, message: 'Patient not found' });
//         }

//         const medicalRecord = await MedicalRecordService.getMedicalRecordByPatientId(patient.id);

//         const { password, ...patientWithoutPassword } = patient.toJSON();

//         res.status(200).json({ status: true, patient: patientWithoutPassword, medicalRecord });
//     } catch (error) {
//         console.error('Error fetching patient profile:', error);
//         res.status(500).json({ status: false, message: 'Internal server error' });
//     }
// };

exports.getPatientById = async (req, res) => {
  // Get patient profile and inside medical records
  try {
    const { patientId } = req.params;
    const patient = await PatientPersonalProfile.findOne({
      where: { patientId },
      include: {
        model: Patient,
        required: true,
        include: {
          model: MedicalRecord,
          include: Doctor,
        },
      },
    });
    if (!patient) {
      return res.status(404).json({ status: false, message: "Patient not found" });
    }
    res.json({ status: true, data: patient });
  } catch (error) {
    console.error("Error fetching patient profile:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};
// controllers/patient.controller.js

exports.getPatients = async (req, res) => {
  try {
    const user = req.user;
    const { includeArchived } = req.query;
    const condition = includeArchived === 'true' ? { isArchived: true } : { isArchived: false };
    if (user.role === "doctor") {
      // Retrieve PatientPersonalProfiles with MedicalRecords for the specified doctorId
      const patientProfiles = await PatientPersonalProfile.findAll({
        include: [
          {
            model: Patient,
            required: true,
            where: condition,
            include: [
              {
                model: MedicalRecord,
                where: { doctorId: user.doctor.id }, // Filter by doctorId
                required: true,
              },
            ],
          },
        ],
      });
      res.json({ status: true, data: patientProfiles });
    } else {
      // Get All patient personal profiles for Admin Dashboard (if no doctorId is specified)
      const patientProfiles = await PatientPersonalProfile.findAll({
        include: [
          { 
            model: Patient,
            required: true,
            where: condition,
          },
        ],
      });
      res.json({ status: true, data: patientProfiles });
    }
  } catch (error) {
    console.error("Error fetching patient profiles:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

exports.archivePatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { isArchived } = req.body;
    const archivedPatient = await Patient.archivePatient(patientId, isArchived);
    res.json({ status: true, message: "Patient archive status updated successfully", data: archivedPatient });
  } catch (error) {
    console.error("Error updating patient archive status:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

exports.getArchivedPatients = async (req, res) => {
  try {
    const patients = await Patient.findAll({
      where: { isArchived: true },
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
    });
    res.json({ status: true, data: patients });
  } catch (error) {
    console.error("Error fetching archived patients:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};