const mongoose = require("mongoose");

const investSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    location: {
      type: String,
      required: [true, "Please add a location"],
    },
    cost: {
      type: String,
      required: [true, "Please add a cost"],
    },
    desc: {
      type: String,
      default: "no description yet.",
    },
    mapLink: {
      type: String,
      required: [true, "Please add map link"],
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

const Invest = mongoose.model("Invest", investSchema);
module.exports = Invest;
