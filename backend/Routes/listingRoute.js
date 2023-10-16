const express = require("express");
const {
  createListing,
  getSingleListing,
  deleteListing,
  updateListing,
} = require("../Controllers/listingController");

const verifyUser = require("../utlis/verifyUser");

const router = express.Router();

router.post("/create", verifyUser, createListing);

router.delete("/delete/:id", verifyUser, deleteListing);

router.post("/update/:id", verifyUser, updateListing);

router.get("/:id", getSingleListing);

module.exports = router;
