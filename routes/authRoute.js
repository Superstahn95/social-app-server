const express = require("express");
const { register, login } = require("../controllers/authController");
const multer = require("../middlewares/multer");

const router = express.Router();

//middleware for file upload needed
router.post(
  "/register",
  (req, res, next) => {
    console.log(req.file);
    next();
  },
  multer.single("profilePicture"),
  register
);
router.post("/login", login);

module.exports = router;
