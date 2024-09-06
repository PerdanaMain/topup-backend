require("dotenv").config();

const express = require("express");
const membershipRouter = require("./routes/memberRouter");
const bannerRouter = require("./routes/bannerRouter");
const serviceRouter = require("./routes/serviceRouter");
const transactionRouter = require("./routes/transactionRouter");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../api-docs.json");
const fs = require("fs");
const path = require("path");

const port = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/assets", express.static("public/images"));

const prefix = "/api/v1";
app.get(prefix + "/", (req, res, next) => {
  try {
    return res.status(200).json({
      status: 0,
      message: "Welcome To Web Service",
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      status: 1,
      message: error.message,
      data: null,
    });
  }
});

app.use(membershipRouter);
app.use(bannerRouter);
app.use(serviceRouter);
app.use(transactionRouter);

// Swagger setup
app.use(
  prefix + "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

// Error handler
app.use((err, req, res, next) => {
  return res.status(500).json({
    status: 1,
    message: err.message,
    data: null,
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
