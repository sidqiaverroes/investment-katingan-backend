const User = require("../models/userModel");
const Token = require("../models/tokenModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

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

//FORGOT PASSWORD ----------------------
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  //Delete token if exist in DB
  let token = await Token.findOne({ userId: user._id });
  if (token) {
    await token.deleteOne();
  }

  let resetToken = crypto.randomBytes(32).toString("hex") + user._id;
  //   console.log(resetToken);

  //Hash token before save to DB
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //Save token to DB
  await new Token({
    userId: user._id,
    token: hashedToken,
    createdAt: Date.now(),
    expiredAt: Date.now() + 30 * (60 * 1000), // 30 minutes
  }).save();

  //Construct reset url
  const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

  //Send reset url to email
  const message = `
  <h2>Hello ${user.name}</h2>
  <p>Please use the url below to reset your password</p>  
  <p>This reset link is valid for only 30 minutes.</p>

  <a href=${resetUrl} clicktracking=off>${resetUrl}</a>

  <p>Regards...</p>
  <p>IVT Team</p>
`;

  const subject = "Password Reset Request";
  const send_to = user.email;
  const sent_from = process.env.EMAIL_USER;

  try {
    await sendEmail(subject, message, send_to, sent_from);
    res.status(200).json({ success: true, message: "Reset email sent" });
  } catch (error) {
    res.status(500);
    throw new Error("Email not sent, please try again");
  }
});

//RESET PASSWORD -------------------------------
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { resetToken } = req.params;

  //Hash token then compare to token in DB
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //Find token in DB
  const userToken = await Token.findOne({
    token: hashedToken,
    expiredAt: { $gt: Date.now() },
  });

  if (!userToken) {
    res.status(404);
    throw new Error("Invalid or expired token");
  }

  //Find user
  const user = await User.findOne({ _id: userToken.userId });
  user.password = password;
  await user.save();
  res.status(200).json({
    message: "Password reset success",
  });
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  loginStatus,
  forgotPassword,
  resetPassword,
};
