// const express = require('express');
// const adminController = require('../controllers/adminController');

// const router = express.Router();

// // Define routes
// router.get('/baka', (req, res) => {
//     res.send('Hello World!');
//   });

// // Route for creating a new admin
// router.post('/admin', adminController.createAdmin);

// // Route for logging in as admin
// router.get('/admin', adminController.loginAdmin);

// module.exports = router;


const express = require('express');
const adminController = require('../controllers/adminController');
const router = express.Router();

router.post('/admin', adminController.createAdmin);
router.get('/admin', adminController.loginAdmin);

module.exports = router;