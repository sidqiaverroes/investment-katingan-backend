const express = require("express");
const router = express.Router();

const {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
} = require("../controllers/productController");

const protect = require("../middleware/protect");

router.post("/", protect, createProduct);
router.get("/", getProducts);
router.get("/:id", getProduct);
router.delete("/:id", protect, deleteProduct);
router.patch("/:id", protect, updateProduct);

module.exports = router;
