const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

//REGISTER USER ------------------------------
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  //Validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill all the required fields");
  }
  if (password.lenght < 6) {
    res.status(400);
    throw new Error("Password at least has 6 characters");
  }

  //Check if user already exist
  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(400);
    throw new Error("Email already registered");
  }

  //Create new user
  const user = await User.create({
    name,
    email,
    password,
  });

  //Generate Token
  const token = generateToken(user._id);

  //Send HTTP-only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), //1 day
    sameSite: "none",
    secure: true,
  });

  if (user) {
    const { _id, name, email } = user;
    res.status(201).json({
      _id,
      name,
      email,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

//LOGIN USER ------------------------------
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //Validate request
  if (!email || !password) {
    res.status(400);
    throw new Error("Please fill the required fields");
  }

  //Check if user exist
  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("User not found, please register");
  }

  console.log(user.password);
  //Check is password correct
  const passIsCorrect = await bcrypt.compare(password, user.password);

  //Generate token
  const token = generateToken(user._id);

  //Send Http-only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), //1 day
    sameSite: "none",
  });

  if (user && passIsCorrect) {
    const { _id, name, email } = user;
    res.status(200).json({
      _id,
      name,
      email,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }
});

//LOGOUT USER ------------------------------
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });
  return res.status(200).json({ message: "Logged Out Successfully" });
});

//GET LOGIN STATUS -------------------------
const loginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json(false);
  }

  //Verify Token
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  if (verified) {
    return res.json(true);
  }

  return res.json(false);
});

module.exports = { registerUser, loginUser, logoutUser, loginStatus };
