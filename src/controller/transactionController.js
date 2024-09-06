const { body, validationResult, param, query } = require("express-validator");
const Member = require("../models/member");
const Transaction = require("../models/transaction");
const Service = require("../models/service");

const generateInvoiceNumber = async () => {
  const date = new Date();
  const formattedDate = `${date.getDate()}${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${date.getFullYear()}`;

  const startOfDay = new Date(date.setHours(0, 0, 0, 0));
  const endOfDay = new Date(date.setHours(23, 59, 59, 999));

  const todayTransaction = await Transaction.countTodayTransaction(
    startOfDay,
    endOfDay
  );
  const invoiceNumber = `INV${formattedDate}-${(todayTransaction + 1)
    .toString()
    .padStart(3, "0")}`;

  return invoiceNumber;
};

const topup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return validationResponse(errors.mapped(), res);

    const { top_up_amount } = req.body;
    const user = req.user;

    const invoice = await generateInvoiceNumber();

    await Member.incrementBalance(top_up_amount, user.id);
    await Transaction.create(user.id, invoice, "TOPUP", top_up_amount);
    const [balance] = await Member.getBalanceMember(user.id);

    return res.status(200).json({
      status: 0,
      message: "Top up balance berhasil",
      data: balance,
    });
  } catch (error) {
    return res.status(500).json({
      status: 102,
      message: error.message,
      data: null,
    });
  }
};
const transaction = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return validationResponse(errors.mapped(), res);

  const { service_code } = req.body;
  const [service] = await Service.find(service_code);
  const [member] = await Member.getBalanceMember(req.user.id);

  if (service[0].service_tariff > member[0].balance)
    return res.status(500).json({
      status: 102,
      message:
        "Maaf, balance anda kurang dari tarif layanan " +
        service[0].service_code,
      data: null,
    });

  const sisa = member[0].balance - service[0].service_tariff;
  const invoice = await generateInvoiceNumber();

  await Member.decrementBalance(sisa, req.user.id);
  const [rows] = await Transaction.create(
    req.user.id,
    invoice,
    service_code,
    service[0].service_tariff
  );
  const [trx] = await Transaction.getTransactionById(rows.insertId);

  try {
    return res.status(200).json({
      status: 0,
      message: "Transaksi berhasil",
      data: trx[0],
    });
  } catch (error) {
    return res.status(500).json({
      status: 102,
      message: error.message,
      data: null,
    });
  }
};
const history = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return validationResponse(errors.mapped(), res);

  const offset = parseInt(req.query.offset);
  const limit = parseInt(req.query.limit);
  const [transactions] = await Transaction.getTransactionByUserId(
    offset,
    limit,
    req.user.id
  );

  try {
    return res.status(200).json({
      status: 0,
      message: "Get history berhasil",
      data: {
        offset,
        limit,
        record: transactions,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 102,
      message: error.message,
      data: null,
    });
  }
};

const validationResponse = (err, res) => {
  if (err.top_up_amount)
    return res.status(400).json({
      status: 1,
      message: err.top_up_amount.msg,
      data: null,
    });
  if (err.service_code)
    return res.status(400).json({
      status: 1,
      message: err.service_code.msg,
      data: null,
    });
  if (err.offset)
    return res.status(400).json({
      status: 1,
      message: err.offset.msg,
      data: null,
    });
  if (err.limit)
    return res.status(400).json({
      status: 1,
      message: err.limit.msg,
      data: null,
    });
};

const validate = (method) => {
  switch (method) {
    case "topup": {
      return [
        body("top_up_amount")
          .notEmpty()
          .withMessage("Top up amount harus disertakan")
          .isNumeric()
          .withMessage("Top up amount harus berupa angka")
          .custom((top_up_amount) => {
            if (top_up_amount < 0) {
              throw new Error("Top up amount harus lebih dari 0");
            }
            return true;
          }),
      ];
    }
    case "transaction": {
      return [
        body("service_code")
          .notEmpty()
          .withMessage("Service harus disertakan")
          .custom(async (service_code) => {
            const [rows] = await Service.find(service_code);
            if (!rows[0]) {
              throw new Error("Service atau layanan tidak ditemukan");
            }

            return true;
          }),
      ];
    }
    case "history": {
      return [
        query("offset")
          .optional()
          .isNumeric()
          .withMessage("Parameter offset harus berupa angka"),
        query("limit")
          .optional()
          .isNumeric()
          .withMessage("Parameter limit harus berupa angka"),
      ];
    }
    default:
      break;
  }
};

module.exports = {
  topup,
  transaction,
  history,
  validate,
};
