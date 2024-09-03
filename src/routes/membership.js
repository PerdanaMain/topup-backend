const express = require("express");

const router = express.Router();

const prefix = "/api/v1";

router.post(prefix + "/login", (req, res, next) => {
  return res.status(200).json({
    message: "route login",
  });
});

module.exports = router;
