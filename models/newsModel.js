const mongoose = require("mongoose");

const newsSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add name"],
    },
    desc: {
      type: String,
      required: [true, "Please add the description"],
    },
    editedBy: {
      type: String,
      required: true,
      default: "-",
    },
    image: {
      type: String,
      required: [true, "Please add an image"],
      default: "https://i.ibb.co/4pDNDk1/avatar.png",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("News", newsSchema);
