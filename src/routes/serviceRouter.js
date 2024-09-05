const express = require("express");
const { index } = require("../controller/serviceController");
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

const prefix = "/api/v1";
router.get(prefix + "/services", verifyToken, index);

module.exports = router;
