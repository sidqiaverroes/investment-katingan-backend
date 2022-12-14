const Product = require("../models/productModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

//CREATE PRODUCT -----------------------------
const createProduct = asyncHandler(async (req, res) => {
  const { name, location, landArea, production, image } = req.body;

  //Validation
  if (!name || !location || !landArea || !production) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }

  try {
    const newProduct = await Product.create({
      name,
      location,
      landArea,
      production,
      image,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500);
    throw new Error("Error, please try again");
  }
});

//GET ALL PRODUCTS ------------------------
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();
  res.status(200).json(products);
});

//GET SINGLE PRODUCT ----------------------
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.status(200).json(product);
});

//DELETE PRODUCT --------------------------
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await product.remove();
  res.status(200).json({ message: "Product successfully deleted" });
});

//UPDATE PRODUCT --------------------------
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(req.user._id);
  const product = await Product.findById(id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  const { name, location, landArea, production, image } = req.body;

  const updatedProduct = await Product.findByIdAndUpdate(
    { _id: id },
    {
      name,
      location,
      landArea,
      production,
      editedBy: user.name,
      image,
    }
  );

  res.status(200).json(updatedProduct);
});

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
};
