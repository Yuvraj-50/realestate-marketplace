const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const connectDB = require("./config/db");

const userRouter = require("./Routes/userRoute");
const authRouter = require("./Routes/authRoute");
const listingRouter = require("./Routes/listingRoute");

const path = require("path");

const PORT = process.env.PORT || 5000;

const app = express();

const x = path.resolve();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(x, "/client/dist")));


app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/listing", listingRouter);

app.get("*", (req, res) => {
  res.sendFile(path.join(x, "client", "dist", "index.html"));
});

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
