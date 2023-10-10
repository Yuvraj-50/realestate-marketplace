const express = require("express");
const { createListing } = require("../Controllers/listingController");
const verifyUser = require("../utlis/verifyUser");

const router = express.Router();

router.post("/create",verifyUser,  createListing);

module.exports = router;
