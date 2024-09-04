const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const header = req.headers["authorization"];
  const token = header && header.split(" ")[1];

  if (!token)
    return res.status(401).json({
      status: 108,
      message: "Token tidak valid atau kadaluarsa",
      data: null,
    });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err)
      return res.status(401).json({
        status: 108,
        message: "Token tidak valid atau kadaluarsa",
        data: null,
      });

    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;
