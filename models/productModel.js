const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add name"],
    },
    location: {
      type: String,
      required: [true, "Please add the location"],
    },
    landArea: {
      type: String,
      required: [true, "Please add land area"],
    },
    production: {
      type: String,
      required: [true, "Please add production information"],
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

module.exports = mongoose.model("Product", productSchema);
