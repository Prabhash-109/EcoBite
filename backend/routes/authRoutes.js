const express = require("express");
const router = express.Router();

const { registerUser, loginUser, firebaseSignIn, firebaseSignUp } = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/firebase-signin", firebaseSignIn);
router.post("/firebase-signup", firebaseSignUp);

module.exports = router;