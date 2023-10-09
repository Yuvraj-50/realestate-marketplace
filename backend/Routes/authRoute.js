const express = require("express");
const {
  signup,
  signin,
  signOut,
  signInWithGoogle,
} = require("../Controllers/authController");
const verifyUser = require("../utlis/verifyUser");

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", signInWithGoogle);
router.get("/signOut/:id", verifyUser, signOut);

module.exports = router;
