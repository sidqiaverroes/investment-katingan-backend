const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  logoutUser,
  loginStatus,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/loginstatus", loginStatus);
router.get("/logout", logoutUser);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resetToken", resetPassword);

module.exports = router;
