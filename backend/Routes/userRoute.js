const express = require("express");

const { usertest } = require("../Controllers/userController");

const router = express.Router();

router.get("/", usertest);

module.exports = router;
