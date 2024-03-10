const express = require('express');
const adminController = require('../controllers/adminController');
const doctorController = require('../controllers/doctorController');
const patientController = require('../controllers/patientController');


const medicolrecordController = require('../controllers/medicolrecordController');


const router = express.Router();

// Admin
router.post('/admin', adminController.createAdmin);
router.get('/admin', adminController.loginAdmin);
router.post('/admin/logout', adminController.logoutAdmin);
router.get('/admin/profile', adminController.getAdminProfile);


// Doctor
router.post('/doctor', doctorController.createDoctor);
router.get('/doctor', doctorController.loginDoctor);
router.post('/doctor/logout', adminController.logoutAdmin);
router.get('/doctor/profile', doctorController.getDoctorProfile);


// Patient
router.post('/patient', patientController.createPatient);
router.get('/patient/login', patientController.loginPatient);
router.post('/patient/logout', adminController.logoutAdmin);
router.get('/patient/profile', patientController.getPatientProfile);

router.post('/medical-record', medicolrecordController.createMedicalRecord); 
router.get('/medical-record/:patientId', medicolrecordController.getMedicalRecordByPatientId); 

module.exports = router;