const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    const timestamp = new Date().getTime();
    const fName = file.originalname;

    cb(null, `${timestamp}-${fName}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Format image tidak sesuai, hanya diperbolehkan upload jpeg dan png"
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1000 * 1000, // 2 MB
  },
  fileFilter,
});

module.exports = upload;
