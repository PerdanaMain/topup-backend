const dbPool = require("../config/database");

const getAll = () => {
  const query = `
  SELECT services.service_code, services.service_name, services.service_tariff, images.name AS image_name
  FROM services
  LEFT JOIN images ON services.image_id = images.id
  `;

  return dbPool.execute(query);
};

module.exports = {
  getAll,
};
