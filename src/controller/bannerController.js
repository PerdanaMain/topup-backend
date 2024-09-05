const Banner = require("../models/banner");

const resourceData = (banners, req) => {
  const hName = req.protocol + "://" + req.headers.host;

  const data = banners.map((banner) => {
    const banner_image = hName + "/assets/" + banner.image_name;

    delete banner.image_name;
    return {
      ...banner,
      banner_image,
    };
  });

  return data;
};

const index = async (req, res, next) => {
  try {
    const [banners] = await Banner.getAll();

    return res.status(200).json({
      status: 0,
      message: "Sukes",
      data: resourceData(banners, req),
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  index,
};
