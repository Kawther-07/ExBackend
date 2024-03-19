const express = require('express');
const adminController = require('../controllers/adminController');
const doctorController = require('../controllers/doctorController');
const patientController = require('../controllers/patientController');
const patientProfileController = require('../controllers/patientProfileController');
const medicalRecordController = require('../controllers/medicalrecordController');

const forgotPasswordController = require('../controllers/forgotPasswordController');

const router = express.Router();

// Admin
router.post('/admin/register', adminController.createAdmin);
router.post('/admin/login', adminController.loginAdmin);
router.post('/admin/logout', adminController.logoutAdmin);
router.get('/admin/profile', adminController.getAdminProfile);


// Doctor
router.post('/doctor/register', doctorController.createDoctor);
router.post('/doctor/login', doctorController.loginDoctor);
router.post('/doctor/logout', adminController.logoutAdmin);
router.get('/doctor/profile', doctorController.getDoctorProfile);


// Patient
router.post('/patient', patientController.createPatient);
router.post('/patient/login', patientController.loginPatient);
router.post('/patient/logout', adminController.logoutAdmin);
// router.get('/patient/profile', patientController.getPatientProfile);

// router.post('/medical-record', medicolrecordController.createMedicalRecord); 
// router.get('/medical-record/:patientId', medicolrecordController.getMedicalRecordByPatientId); 


// Create patient personal profile
router.post('/patient/profile', patientProfileController.createPatientProfile);
// Get patient personal profile by patientId
router.get('/patient/profile/:patientId', patientProfileController.getPatientProfile);

// Medical record routes
router.post('/medical-record', medicalRecordController.createMedicalRecord);
router.get('/medical-record/:patientId', medicalRecordController.getMedicalRecord);


// Forgot password
router.post('/forgot-password', forgotPasswordController.forgotPassword);
router.post('/verify-code', forgotPasswordController.verifyCode);
router.post('/reset-password', forgotPasswordController.resetPassword);

module.exports = router;