const asyncHandler = require("express-async-handler");
const sendEmail = require("../utils/sendEmail");

const hubungi = asyncHandler(async (req, res) => {
  const { name, email, subjek, pesan } = req.body;

  //   Validation
  if (!subject || !message) {
    res.status(400);
    throw new Error("Please add subject and message");
  }

  const send_to = process.env.EMAIL_USER;
  const sent_from = email;
  const reply_to = name;
  const subject = subjek;
  const message = pesan;
  try {
    await sendEmail(subject, message, send_to, sent_from, reply_to);
    res.status(200).json({ success: true, message: "Email Sent" });
  } catch (error) {
    res.status(500);
    throw new Error("Email not sent, please try again");
  }
});

module.exports = {
  hubungi,
};
