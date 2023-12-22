const multer = require("multer");
const CustomError = require("../utils/customError");

const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
  console.log("we just hit here");
  console.log(file);
  if (!file.mimetype.includes("image")) {
    console.log("this is not an image");
    const err = new CustomError("You can only upload an image", 400);
    return cb(err, false);
  }
  console.log("this is an image");
  cb(null, true);
};

module.exports = multer({ storage, fileFilter });
