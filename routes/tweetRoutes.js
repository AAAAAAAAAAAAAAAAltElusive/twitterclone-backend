const { createTweet, updateTweet, deleteTweet, getTweets, getTweetById} = require("../controllers/tweetController");
const {checkUser} = require("../middlewares/authMiddleware")
const express = require("express");
const router = express.Router();

router.get("/", checkUser, getTweets)
router.post("/", checkUser, createTweet);
router.put("/:id", checkUser, updateTweet);
router.delete("/:id", checkUser, deleteTweet);
router.get("/:id", checkUser, getTweetById);

module.exports = router;
