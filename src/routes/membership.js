const express = require("express");
const {
  login,
  registration,
  validate,
} = require("../controller/membershipController");

const router = express.Router();

const prefix = "/api/v1";

router.post(prefix + "/registration", validate("registration"), registration);
router.post(prefix + "/login", validate("login"), login);

module.exports = router;
