const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  logoutUser,
  loginStatus,
} = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/loginstatus", loginStatus);
router.get("/logout", logoutUser);

module.exports = router;
