const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();


function connectDB() {
  mongoose
    .connect(process.env.MONGODBURL)
    .then(() => {
      console.log("Database connected");
    })
    .catch((error) => {
      console.log("Error connecting to database", error);
    });
}

module.exports = connectDB;
