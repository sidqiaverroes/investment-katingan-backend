const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  logoutUser,
  loginStatus,
  forgotPassword,
  resetPassword,
  getUser,
  updateUser,
} = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/loginstatus", loginStatus);
router.post("/logout", logoutUser);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resetToken", resetPassword);
router.get("/getuser", protect, getUser);
router.patch("/updateuser", protect, updateUser);

module.exports = router;
