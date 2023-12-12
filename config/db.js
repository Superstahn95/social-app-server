const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const conn = mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
    console.log("connected to database");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDb;
