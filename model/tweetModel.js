const mongoose = require("mongoose");

const tweetSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "User ID is Required"],
      ref: "User",
    },
    text: {
      type: String,
      required: [true, "Text is Required"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    imageUrl: {
      type: String,
      default: null
    }

  });
  
  module.exports = mongoose.model("Tweets", tweetSchema);
  