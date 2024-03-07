const express = require('express');
const adminController = require('../controllers/adminController');
const router = express.Router();

router.post('/admin', adminController.createAdmin);
router.get('/admin', adminController.loginAdmin);

module.exports = router;