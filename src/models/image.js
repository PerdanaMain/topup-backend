const dbPool = require("../config/database");

const create = (name) => {
  const query = `
  INSERT INTO images (name)
  VALUES (?)
  `;

  return dbPool.execute(query, [name]);
};

const update = (id, name) => {
  const query = `
  UPDATE images
  SET name = ?
  WHERE id = ?
  `;

  return dbPool.execute(query, [name, id]);
};

module.exports = {
  create,
  update,
};
