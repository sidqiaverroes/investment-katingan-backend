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
  changePassword,
} = require("../controllers/userController");
const protect = require("../middleware/protect");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/loginstatus", loginStatus);
router.post("/logout", logoutUser);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resetToken", resetPassword);
router.get("/getuser", protect, getUser);
router.patch("/updateuser", protect, updateUser);
router.patch("/changepassword", protect, changePassword);

module.exports = router;
