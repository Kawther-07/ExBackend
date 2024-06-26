const express = require("express");
require('dotenv').config();
const adminController = require("../controllers/adminController");
const doctorController = require("../controllers/doctorController");
const patientController = require("../controllers/patientController");
const patientProfileController = require("../controllers/patientProfileController");
const medicalRecordController = require("../controllers/medicalRecordController");
const forgotPasswordController = require("../controllers/forgotPasswordController");
const glycemiaController = require("../controllers/glycemiaController");
const dfuRecordController = require("../controllers/dfuRecordController");
const educResourceController = require("../controllers/educResourceController");
const dashboardController = require("../controllers/dashboardController");

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

// Routes that require authentication
router.get("/doctors", Authorize(["admin"]), doctorController.getDoctors);
router.get("/doctor/:doctorId", Authorize(["admin"]), doctorController.getDoctorById);
router.put("/doctor/:doctorId", Authorize(["admin", "doctor"]), doctorController.updateDoctorProfile);
router.patch("/doctors/archive/:doctorId", doctorController.archiveDoctor);
router.get("/doctors/archived", doctorController.getArchivedDoctors);
router.post("/auth/login", authController.loginAdminAndDoctor);
router.post("/auth/verifyUserToken", authController.verifyUserToken);
router.get("/doctors/list", doctorController.getDoctorList);

// Public route (no authentication required)
router.get("/doctorId", doctorController.getDoctorIdByName);

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
router.post("/reset-password-admins-doctors", forgotPasswordController.resetPasswordAdminAndDoctors);

// Glycemia
router.post("/glycemia", glycemiaController.createGlycemiaRecord);
router.get("/glycemia/:patientId", glycemiaController.getGlycemiaRecordsByPatientIdAndDateRange);

// DFU record
router.post('/uploadPic', dfuRecordController.uploadImage);
router.post("/dfu-record", dfuRecordController.createDfuRecordWithImage);
router.get("/dfu-record/:patientId", dfuRecordController.getDfuRecordsByMedicalRecordId);
// router.post("/dfu-record/upload", upload.single("image"), dfuRecordController.uploadImage);
router.get("/dfu-records-by-doctor-id/:doctorId", dfuRecordController.getDFURecordsByDoctorId);

// Educational resources
router.post("/educational-resources", educResourceController.createEducationalResource);
router.get("/educational-resources", educResourceController.getAllEducationalResources);
router.get("/educational-resources/:id", educResourceController.getEducationalResourceById);

// Files Upload
router.post("/upload", upload().array("files", 5), uploadController.uploadFiles);

// Dashboard statistics
router.get("/dashboard/statistics", Authorize(["doctor", "admin"]), dashboardController.getStatistics);

module.exports = router;
