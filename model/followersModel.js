const mongoose = require("mongoose");

const followersSchema = new mongoose.Schema({
  followerUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "User ID is Required"],
    ref: "User",
  },
  followingUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Following User ID is Required"],
    ref: "User",
  },
});

module.exports = mongoose.model("Followers", followersSchema);