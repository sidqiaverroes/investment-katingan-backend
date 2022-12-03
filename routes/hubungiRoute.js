const express = require("express");
const { hubungi } = require("../controllers/hubungiController");
const router = express.Router();

router.post("/", hubungi);

module.exports = router;
