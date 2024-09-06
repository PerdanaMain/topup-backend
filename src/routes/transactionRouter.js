const express = require("express");
const { getBalance } = require("../controller/membershipController");
const {
  topup,
  transaction,
  history,
  validate,
} = require("../controller/transactionController");
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

const prefix = "/api/v1";
router.get(prefix + "/balance", verifyToken, getBalance);
router.get(prefix + "/transaction/history", verifyToken, history);
router.post(prefix + "/topup", verifyToken, validate("topup"), topup);
router.post(
  prefix + "/transaction",
  verifyToken,
  validate("transaction"),
  transaction
);

module.exports = router;
