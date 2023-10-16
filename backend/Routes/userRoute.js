const express = require("express");

const { updateUser, deleteUser, getUserListing } = require("../Controllers/userController");
const verifyUser = require("../utlis/verifyUser");

const router = express.Router();

router.post("/update/:id", verifyUser, updateUser);
router.delete("/delete/:id", verifyUser, deleteUser);
router.get("/listing/:id" , verifyUser, getUserListing)

module.exports = router;
