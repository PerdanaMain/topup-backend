const Service = require("../models/service");

const resourceData = (services, req) => {
  const hName = req.protocol + "://" + req.headers.host;

  const data = services.map((service) => {
    const service_icon = hName + "/assets/" + service.image_name;

    delete service.image_name;
    return {
      ...service,
      service_icon,
    };
  });

  return data;
};

const index = async (req, res, next) => {
  try {
    const [services] = await Service.getAll();

    return res.status(200).json({
      status: 0,
      message: "Sukes",
      data: resourceData(services, req),
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
