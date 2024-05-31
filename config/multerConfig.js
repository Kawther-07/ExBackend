// const multer = require('multer');

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });

// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1024 * 1024 * 10, // 10 MB limit
//     files: 1 // Limit to one file
//   }
// });

// module.exports = upload;
