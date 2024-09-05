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

const getMemberById = (id) => {
  const query = `
  SELECT users.first_name, users.last_name, users.email, users.image_id, images.name AS image_name
  FROM users
  LEFT JOIN images ON users.image_id = images.id
  WHERE users.id = ?
  `;

  return dbPool.execute(query, [id]);
};

const update = (id, first_name, last_name, image_id) => {
  const query = `
  UPDATE users
  SET first_name=?,last_name=?, image_id=COALESCE(?,image_id)
  WHERE id = ?
  `;

  return dbPool.execute(query, [first_name, last_name, image_id, id]);
};

module.exports = {
  getMemberByEmail,
  getMemberById,
  create,
  update,
};
