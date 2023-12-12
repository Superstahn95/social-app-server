const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { fileURLToPath } = require("url"); //will allow us to set the path when we configure directories later on..when using modules
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const connectDb = require("./config/db");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
// configurations
// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)  if i decide to use modules instead of common js

app.use(express.json());
app.use(morgan("common"));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// routes
app.use("/api/v1/auth", require("./routes/authRoute"));

app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
  connectDb();
});
