const asyncErrorHandler = require("../utils/asyncErrorHandler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const CustomError = require("../utils/customError");

exports.register = asyncErrorHandler(async (req, res, next) => {
  const { firstName, lastName, email, password, location, occupation } =
    req.body;
  const { file } = req;
  //handle file upload
  const salt = await bcrypt.genSalt(10);
  const hashedPwd = await bcrypt.hash(password, salt);
  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPwd,
    location,
    occupation,
    viewedProfile: Math.floor(Math.random() * 10000),
    impressions: Math.floor(Math.random() * 10000),
  });
  const savedUser = await newUser.save();
  res.status(201).json({
    status: "success",
    user: savedUser,
  });
});

exports.login = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    const err = new CustomError("Invalid credentials", 400);
    return next(err);
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    const err = new CustomError("Invalid credentials", 400);
    return next(err);
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  delete user.password;
  res.status(200).json({
    status: "success",
    user,
    token,
  });
});
