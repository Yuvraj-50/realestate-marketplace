const express = require("express");
const connectDB = require("./config/db");
const userRoute = require("./Routes/userRoute");
const authRoute = require("./Routes/authRoute");

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome to infiti estate");
});

app.use("/api/v1/users", userRoute);
app.use("/api/v1/auth", authRoute);

app.listen(PORT, () => console.log("Server running on port 5000"));
connectDB();

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
