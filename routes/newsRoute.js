const express = require("express");
const router = express.Router();

const {
  createNews,
  getNews,
  getOneNews,
  deleteNews,
  updateNews,
} = require("../controllers/newsController");

const protect = require("../middleware/protect");

router.post("/", protect, createNews);
router.get("/", getNews);
router.get("/:id", getOneNews);
router.delete("/:id", protect, deleteNews);
router.patch("/:id", protect, updateNews);

module.exports = router;
