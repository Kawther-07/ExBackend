const express = require('express');
const adminController = require('../controllers/adminController');
const doctorController = require('../controllers/doctorController');
const patientController = require('../controllers/patientController');
const router = express.Router();

router.post('/admin', adminController.createAdmin);
router.get('/admin', adminController.loginAdmin);

router.post('/doctor', doctorController.createDoctor);
router.get('/doctor', doctorController.loginDoctor);

router.post('/patient', patientController.createPatient);
router.get('/patient', patientController.loginPatient);

module.exports = router;