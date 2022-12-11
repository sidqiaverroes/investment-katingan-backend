const News = require("../models/newsModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

//CREATE NEWS -----------------------------
const createNews = asyncHandler(async (req, res) => {
  const { title, desc, editedBy, image } = req.body;

  //Validation
  if (!title || !desc) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }

  try {
    const newNews = await News.create({
      title,
      desc,
      editedBy,
      image,
    });

    res.status(201).json(newNews);
  } catch (error) {
    res.status(500);
    throw new Error(error, "Error, please try again");
  }
});

//GET ALL PRODUCTS ------------------------
const getNews = asyncHandler(async (req, res) => {
  const news = await News.find().sort({ editedAt: -1 });
  res.status(200).json(news);
});

//GET SINGLE NEWS ----------------------
const getOneNews = asyncHandler(async (req, res) => {
  const news = await News.findById(req.params.id);

  if (!news) {
    res.status(404);
    throw new Error("News not found");
  }
  res.status(200).json(news);
});

//DELETE NEWS --------------------------
const deleteNews = asyncHandler(async (req, res) => {
  const news = await News.findById(req.params.id);

  if (!news) {
    res.status(404);
    throw new Error("News not found");
  }

  await news.remove();
  res.status(200).json({ message: "News successfully deleted" });
});

//UPDATE NEWS --------------------------
const updateNews = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(req.user._id);

  const news = await News.findById(id);

  if (!news) {
    res.status(404);
    throw new Error("News not found");
  }
  const { title, desc, image } = req.body;

  const updatedNews = await News.findByIdAndUpdate(
    { _id: id },
    {
      title,
      desc,
      editedBy: user.name,
      image,
    }
  );

  res.status(200).json(updatedNews);
});

module.exports = {
  createNews,
  getNews,
  getOneNews,
  deleteNews,
  updateNews,
};
