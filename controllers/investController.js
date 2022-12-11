const Invest = require("../models/investModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

//CREATE INVESTMENT -----------------------------
const createInvest = asyncHandler(async (req, res) => {
  const { name, location, cost, mapLink, desc, image } = req.body;

  //Validation
  if (!name || !location || !cost || !mapLink) {
    res.status(400);
    throw new Error("Please fill in the required fields");
  }

  try {
    const newInvest = await Invest.create({
      name,
      location,
      cost,
      mapLink,
      desc,
      image,
    });

    res.status(201).json(newInvest);
  } catch (error) {
    res.status(500);
    throw new Error("Error, please try again");
  }
});

//GET ALL INVESTMENTS ------------------------
const getInvests = asyncHandler(async (req, res) => {
  const invests = await Invest.find();
  res.status(200).json(invests);
});

//GET SINGLE INVESTMENT ----------------------
const getInvest = asyncHandler(async (req, res) => {
  const invest = await Invest.findById(req.params.id);

  if (!invest) {
    res.status(404);
    throw new Error("Investment not found");
  }
  res.status(200).json(invest);
});

//DELETE INVESTMENT --------------------------
const deleteInvest = asyncHandler(async (req, res) => {
  const invest = await Invest.findById(req.params.id);

  if (!invest) {
    res.status(404);
    throw new Error("Investment not found");
  }

  await invest.remove();
  res.status(200).json({ message: "Investment successfully deleted" });
});

//UPDATE INVESTMENT --------------------------
const updateInvest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(req.user._id);
  const invest = await Invest.findById(id);

  if (!invest) {
    res.status(404);
    throw new Error("Investment not found");
  }
  const { name, location, cost, mapLink, desc, image } = req.body;

  const updatedInvest = await Invest.findByIdAndUpdate(
    { _id: id },
    {
      name,
      location,
      cost,
      mapLink,
      desc,
      editedBy: user.name,
      image,
    }
  );

  res.status(200).json(updatedInvest);
});

module.exports = {
  createInvest,
  getInvests,
  getInvest,
  deleteInvest,
  updateInvest,
};
