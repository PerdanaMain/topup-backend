const dbPool = require("../config/database");

const create = (user_id, invoice_number, transaction_type, total_amount) => {
  const query = `
    INSERT INTO transactions (user_id,invoice_number,transaction_type,total_amount)
    VALUES (?, ?, ?, ?)
  `;

  return dbPool.execute(query, [
    user_id,
    invoice_number,
    transaction_type,
    total_amount,
  ]);
};

const countTodayTransaction = async (startOfDay, endOfDay) => {
  const query = `
  SELECT COUNT(*) as count
  FROM transactions
  WHERE created_at >= ? AND created_at < ?
  `;

  const [rows] = await dbPool.execute(query, [startOfDay, endOfDay]);
  return rows[0].count;
};

const getTransactionById = (id) => {
  const query = `
  SELECT transactions.invoice_number, services.service_code, services.service_name, transactions.transaction_type, transactions.total_amount, transactions.created_at AS created_on
  FROM transactions
  LEFT JOIN services ON transactions.transaction_type = services.service_code
  WHERE transactions.id = ?
  `;

  return dbPool.execute(query, [id]);
};

module.exports = {
  create,
  countTodayTransaction,
  getTransactionById,
};
