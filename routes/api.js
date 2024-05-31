const express = require("express");
const adminController = require("../controllers/adminController");
const doctorController = require("../controllers/doctorController");
const patientController = require("../controllers/patientController");
const patientProfileController = require("../controllers/patientProfileController");
const medicalRecordController = require("../controllers/medicalrecordController");
const forgotPasswordController = require("../controllers/forgotPasswordController");
const glycemiaController = require("../controllers/glycemiaController");
const authController = require("../controllers/authController");
const Authorize = require("../middlewares/middlewares");
const uploadController = require("../controllers/uploadController");
const upload = require("../services/upload.service");
const router = express.Router();

// Admin
router.post("/admin/register", adminController.createAdmin);
router.post("/admin/login", adminController.loginAdmin);
router.post("/admin/logout", adminController.logoutAdmin);
router.get("/admin/profile", adminController.getAdminProfile);
router.put("/admin/:adminId", Authorize(["admin", "doctor"]), adminController.updateAdminProfile);

// Doctor
router.post("/doctor/register", doctorController.createDoctor);
router.post("/doctor/login", doctorController.loginDoctor);
router.post("/doctor/logout", doctorController.logoutDoctor);
router.get("/doctor/profile", doctorController.getDoctorProfile);
router.get("/doctors", Authorize(["admin"]), doctorController.getDoctors);
router.get("/doctor/:doctorId", Authorize(["admin"]), doctorController.getDoctorById);
router.put("/doctor/:doctorId", Authorize(["admin", "doctor"]), doctorController.updateDoctorProfile);
// doctor.controller.js
router.patch('/doctors/archive/:doctorId', doctorController.archiveDoctor);
router.get('/doctors/archived', doctorController.getArchivedDoctors);
// Doctor And Admin Login
router.post("/auth/login", authController.loginAdminAndDoctor);
router.post("/auth/verifyUserToken", authController.verifyUserToken);

// Patient
router.post("/patient", patientController.createPatient);
router.post("/patient/login", patientController.loginPatient);
router.post("/patient/logout", patientController.logoutPatient);
router.get("/patients", Authorize(["admin", "doctor"]), patientController.getPatients);
router.get("/patient/:patientId", Authorize(["admin", "doctor"]), patientController.getPatientById);
router.patch('/patients/archive/:patientId', patientController.archivePatient);
router.get('/patients/archived', patientController.getArchivedPatients);

// Get patient name by patient ID
router.get("/patient/name/:patientId", patientController.getPatientNameById);
// router.get('/patient/profile', patientController.getPatientProfile);

// router.post('/medical-record', medicolrecordController.createMedicalRecord);
// router.get('/medical-record/:patientId', medicolrecordController.getMedicalRecordByPatientId);

router.put("/patient/updateprofile/:patientId", patientProfileController.updatePatientProfile);

// Create patient personal profile
router.post("/patient/profile", patientProfileController.createPatientProfile);
// Get patient personal profile by patientId
router.get("/patient/profile/:patientId", patientProfileController.getPatientProfile);

// Medical record routes
router.post("/medical-record", medicalRecordController.createMedicalRecord);
router.get("/medical-record/:patientId", medicalRecordController.getMedicalRecord);

// Forgot password
router.post("/forgot-password", forgotPasswordController.forgotPassword);
router.post("/verify-code", forgotPasswordController.verifyCode);
router.post("/reset-password", forgotPasswordController.resetPassword);

// Route to create a new glycemia record
router.post("/glycemia", glycemiaController.createGlycemiaRecord);

// Route to get glycemia records by patient ID
router.get("/glycemia/:patientId", glycemiaController.getGlycemiaRecordsByPatientId);

// Files Upload
router.post("/upload", upload().array("files", 5), uploadController.uploadFiles);

module.exports = router;
