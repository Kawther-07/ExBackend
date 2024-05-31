const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const upload = () => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      if (!req.body.folder) {
        cb(new Error("No folder specified"), null);
      } else {
        cb(null, "assets/uploads/" + req.body.folder);
      }
    },
    filename: function (req, file, cb) {
      let ext = path.extname(file.originalname);
      cb(null, uuidv4() + ext);
    },
  });

  return multer({ storage: storage });
};

module.exports = upload;
