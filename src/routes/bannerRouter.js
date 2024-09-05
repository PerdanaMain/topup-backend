const express = require("express");
const { index } = require("../controller/bannerController");
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

const prefix = "/api/v1";
router.get(prefix + "/banner", verifyToken, index);

module.exports = router;
