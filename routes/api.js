const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();

// Route for creating a new admin
router.post('/admin/create', adminController.createAdmin);

// Route for logging in as admin
router.get('/admin/login', adminController.loginAdmin);

module.exports = router;
