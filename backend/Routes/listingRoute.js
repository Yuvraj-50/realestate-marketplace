const express = require("express");
const {
  createListing,
  getSingleListing,
  deleteListing,
  updateListing,
  getListings,
} = require("../Controllers/listingController");

const verifyUser = require("../utlis/verifyUser");

const router = express.Router();

router.post("/create", verifyUser, createListing);

router.delete("/delete/:id", verifyUser, deleteListing);

router.post("/update/:id", verifyUser, updateListing);

router.get("/getListings", getListings);

router.get("/:id", getSingleListing);


module.exports = router;
