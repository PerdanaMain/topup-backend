const dbPool = require("../config/database");

const getMemberByEmail = (email) => {
  const query = `
  SELECT users.id, users.first_name, users.last_name, users.email, users.password
  FROM users
  WHERE email = ?
  `;

  return dbPool.execute(query, [email]);
};

const create = (email, hashedPassword, first_name, last_name) => {
  const query = `
  INSERT INTO users (email,password,first_name,last_name)
  VALUES (?,?,?,?)
  `;

  return dbPool.execute(query, [email, hashedPassword, first_name, last_name]);
};

module.exports = {
  getMemberByEmail,
  create,
};
