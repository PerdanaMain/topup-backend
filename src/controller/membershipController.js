const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const { body, validationResult } = require("express-validator");
const Member = require("../models/member");
const Image = require("../models/image");
const path = require("path");

const registration = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return validationResponse(errors.mapped(), res);

    const { email, password, first_name, last_name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await Member.create(email, hashedPassword, first_name, last_name);

    return res.status(200).json({
      status: 0,
      message: "Registrasi berhasil silahkan login",
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      status: 1,
      message: error.message,
      data: null,
    });
  }
};

const validationResponse = (err, res) => {
  if (err.email)
    return res.status(400).json({
      status: 1,
      message: err.email.msg,
      data: null,
    });
  if (err.password)
    return res.status(400).json({
      status: 1,
      message: err.password.msg,
      data: null,
    });
  if (err.first_name)
    return res.status(400).json({
      status: 1,
      message: err.first_name.msg,
      data: null,
    });
  if (err.last_name)
    return res.status(400).json({
      status: 1,
      message: err.last_name.msg,
      data: null,
    });
};

const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return validationResponse(errors.mapped(), res);

    const { email, password } = req.body;
    const [member] = await Member.getMemberByEmail(email);
    const match = await bcrypt.compare(password, member[0].password);

    if (!match)
      return res.status(401).json({
        status: 1,
        message: "Username atau password salah",
        data: null,
      });

    const token = jwt.sign(
      {
        id: member[0].id,
        first_name: member[0].first_name,
        last_name: member[0].last_name,
        email: member[0].email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "12h",
      }
    );

    return res.status(200).json({
      status: 0,
      message: "Login sukses",
      data: {
        token,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 1,
      message: error.message,
      data: null,
    });
  }
};

const resourceData = (member, req) => {
  const hName = req.protocol + "://" + req.headers.host;
  const profile_image = hName + "/assets/" + member.image_name;

  const data = {
    ...member,
    profile_image: member.image_name == null ? null : profile_image,
  };

  delete data.image_name;
  delete data.image_id;
  return data;
};

const index = async (req, res, next) => {
  try {
    const [member] = await Member.getMemberById(req.user.id);

    return res.status(200).json({
      status: 0,
      message: "Sukses",
      data: resourceData(member[0], req),
    });
  } catch (error) {
    return res.status(500).json({
      status: 1,
      message: error.message,
      data: null,
    });
  }
};

const update = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return validationResponse(errors.mapped(), res);

    const { first_name, last_name } = req.body;
    const user = req.user;
    await Member.update(user.id, first_name, last_name, null);
    const [member] = await Member.getMemberById(user.id);

    return res.status(200).json({
      status: 0,
      message: "Update profile berhasil",
      data: resourceData(member[0], req),
    });
  } catch (error) {
    return res.status(500).json({
      status: 1,
      message: error.message,
      data: null,
    });
  }
};

const uploadImage = async (req, res, next) => {
  try {
    const file = req.file;
    const user = req.user;
    const [row] = await Member.getMemberById(user.id);

    if (row[0].image_name == null) {
      const [image] = await Image.create(file.filename);
      await Member.update(
        user.id,
        user.first_name,
        user.last_name,
        image.insertId
      );
    } else {
      const filePath = path.join(
        path.resolve(__dirname, "../../"),
        "public/images",
        row[0].image_name
      );
      fs.unlink(filePath, async (err) => {
        if (err) {
          return res.status(400).json({
            status: 1,
            message: "File tidak ditemukan",
            data: null,
          });
        }
      });
      await Image.update(row[0].image_id, file.filename);
    }

    const [member] = await Member.getMemberById(user.id);

    return res.status(200).json({
      message: "Upload berhasil",
      data: resourceData(member[0], req),
    });
  } catch (error) {
    return res.status(500).json({
      status: 102,
      message: error.message,
      data: null,
    });
  }
};

const validate = (method) => {
  switch (method) {
    case "registration": {
      return [
        body("email")
          .notEmpty()
          .withMessage("Email tidak boleh kosong")
          .isEmail()
          .withMessage("Parameter email tidak sesuai format")
          .custom(async (email) => {
            const [row] = await Member.getMemberByEmail(email);
            if (row[0]) {
              throw new Error("Email telah terdaftar!");
            }
            return true;
          }),
        body("password")
          .notEmpty()
          .withMessage("Password tidak boleh kosong")
          .isLength({ min: 8 })
          .withMessage("Password minimal 8 karakter"),
        body("first_name")
          .notEmpty()
          .withMessage("First name tidak boleh kosong"),
        body("last_name")
          .notEmpty()
          .withMessage("Last name tidak boleh kosong"),
      ];
    }
    case "login": {
      return [
        body("email")
          .notEmpty()
          .withMessage("Email tidak boleh kosong")
          .isEmail()
          .withMessage("Parameter email tidak sesuai format")
          .custom(async (email) => {
            const [row] = await Member.getMemberByEmail(email);
            if (!row[0]) {
              throw new Error("Username atau password salah");
            }
            return true;
          }),
        body("password").notEmpty().withMessage("Password tidak boleh kosong"),
      ];
    }
    case "update": {
      return [
        body("first_name")
          .notEmpty()
          .withMessage("First name tidak boleh kosong"),
        body("last_name")
          .notEmpty()
          .withMessage("Last name tidak boleh kosong"),
      ];
    }
    default:
      break;
  }
};

module.exports = {
  login,
  registration,
  index,
  update,
  uploadImage,
  validate,
};
