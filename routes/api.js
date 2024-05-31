const express = require("express");
const adminController = require("../controllers/adminController");
const doctorController = require("../controllers/doctorController");
const patientController = require("../controllers/patientController");
const patientProfileController = require("../controllers/patientProfileController");
const medicalRecordController = require("../controllers/medicalRecordController");
const forgotPasswordController = require("../controllers/forgotPasswordController");
const glycemiaController = require("../controllers/glycemiaController");
const dfuRecordController = require("../controllers/dfuRecordController");
const educResourceController = require("../controllers/educResourceController");

const authController = require("../controllers/authController");
const Authorize = require("../middlewares/middlewares");
const uploadController = require("../controllers/uploadController");
const upload = require("../services/upload.service");
// const upload = require("../config/multerConfig"); 
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



// Define route to fetch list of doctors
router.get("/doctors", doctorController.getDoctorList);
// New route to fetch doctor ID by name
router.get("/doctor/id", doctorController.getDoctorIdByName);

// Patient
router.post("/patient/register", patientController.createPatient);
router.post("/patient/login", patientController.loginPatient);
router.post("/patient/logout", patientController.logoutPatient);

// Ines
router.get("/patients", Authorize(["admin", "doctor"]), patientController.getPatients);
router.get("/patient/:patientId", Authorize(["admin", "doctor"]), patientController.getPatientById);
router.patch('/patients/archive/:patientId', patientController.archivePatient);
router.get('/patients/archived', patientController.getArchivedPatients);


// Patient personal profile
router.get("/patient/name/:patientId", patientController.getPatientNameById);
router.patch("/patient/updateprofile/:patientId", patientProfileController.updatePatientProfile);
router.post("/patient/profile", patientProfileController.createPatientProfile);
router.get("/patient/profile/:patientId", patientProfileController.getPatientProfile);

// // Patient medical record
// router.post("/medical-record", medicalRecordController.createMedicalRecord);
// router.get("/medical-record/:patientId", medicalRecordController.getMedicalRecord);
// router.patch("/updatemedicalrecord/:patientId", medicalRecordController.updateMedicalRecord);

router.post("/medical-record", medicalRecordController.createMedicalRecord);
router.get("/medical-record/:patientId", medicalRecordController.getMedicalRecord);
//router.patch("/medical-record/:patientId", medicalRecordController.updateMedicalRecord);
// router.patch("/medical-record/:medicalRecordId", medicalRecordController.updateMedicalRecord);
router.patch("/medical-record/patient/:patientId", medicalRecordController.updateMedicalRecordByPatientId);
// Route to fetch Medical Record ID by Patient ID
router.get("/medical-record-id/:patientId", medicalRecordController.getMedicalRecordIdByPatientId);


// Forgot password
router.post("/forgot-password", forgotPasswordController.forgotPassword);
router.post("/verify-code", forgotPasswordController.verifyCode);
router.post("/reset-password", forgotPasswordController.resetPassword);

// Glycemia
router.post("/glycemia", glycemiaController.createGlycemiaRecord);
router.get("/glycemia/:patientId", glycemiaController.getGlycemiaRecordsByPatientIdAndDateRange);

// DFU record
router.post("/dfu-record", dfuRecordController.createDfuRecordWithImage);
router.get("/dfu-record/:patientId", dfuRecordController.getDfuRecordsByPatientId);
// router.post("/dfu-record/upload", upload.single("image"), dfuRecordController.uploadImage);

// Educational resources
router.post("/educational-resources", educResourceController.createEducationalResource);
router.get("/educational-resources", educResourceController.getAllEducationalResources);
router.get("/educational-resources/:id", educResourceController.getEducationalResourceById);


// Files Upload
router.post("/upload", upload().array("files", 5), uploadController.uploadFiles);

module.exports = router;