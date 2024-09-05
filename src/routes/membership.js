const express = require("express");
const {
  login,
  registration,
  validate,
  index,
  update,
  uploadImage,
} = require("../controller/membershipController");

const verifyToken = require("../middlewares/verifyToken");
const upload = require("../middlewares/multer");
const multer = require("multer");

const router = express.Router();

const prefix = "/api/v1";

router.post(prefix + "/registration", validate("registration"), registration);
router.post(prefix + "/login", validate("login"), login);
router.get(prefix + "/profile", verifyToken, index);
router.put(prefix + "/profile/update", verifyToken, validate("update"), update);
router.put(
  prefix + "/profile/image",
  verifyToken,
  upload.single("file"),
  uploadImage
);

module.exports = router;
