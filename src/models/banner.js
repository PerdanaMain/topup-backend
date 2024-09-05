const dbPool = require("../config/database");

const getAll = () => {
  const query = `
  SELECT banners.banner_name, banners.description, images.name AS image_name
  FROM banners
  LEFT JOIN images ON banners.image_id = images.id
  `;

  return dbPool.execute(query);
};

module.exports = {
  getAll,
};
