const express = require("express");
const PORT = process.env.PORT || 5000;
const app = express();

app.get("/", (req, res) => {
  res.send("Welcome to infiti estate");
});

app.listen(PORT, () => console.log("Server running on port 5000"));
