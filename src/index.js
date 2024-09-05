require("dotenv").config();

const express = require("express");
const membershipRouter = require("./routes/membership");

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
