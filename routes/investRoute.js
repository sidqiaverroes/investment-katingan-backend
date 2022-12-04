const express = require("express");
const router = express.Router();

const {
  createInvest,
  getInvests,
  getInvest,
  deleteInvest,
  updateInvest,
} = require("../controllers/investController");

const protect = require("../middleware/protect");

router.post("/", createInvest);
router.get("/", getInvests);
router.get("/:id", getInvest);
router.delete("/:id", protect, deleteInvest);
router.patch("/:id", protect, updateInvest);

module.exports = router;
