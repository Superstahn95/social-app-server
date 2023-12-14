const jwt = require("jsonwebtoken");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/customError");
const User = require("../models/user");

exports.verifyToken = asyncErrorHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    const err = new CustomError("Access denied", 403);
    return next(err);
  }
  const verified = jwt.verify(token, process.env.JWT_SECRET);

  req.user = verified;
  next();
});
