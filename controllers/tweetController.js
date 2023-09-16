const express = require("express");
const router = express.Router();
const tweetModel = require("../model/tweetModel");

module.exports = {
  async getTweets(req, res) {
    const userId = req.user._id;

    console.log(userId);

    // Check if the user has any tweets.
    const tweets = await tweetModel.find({user: userId}).populate('user', 'username');;

    console.log(tweets);

    // If the user does not have any tweets, return an empty array.
    if (!tweets || tweets.length === 0) {
      res.json([]);
      return;
    }

    res.status(200).json(tweets);
  },

  async getTweetById(req, res) {
    try {
      const tweetId = req.params.tweetId;
      let tweet = await tweetModel.findById(tweetId).populate('user', 'username');
      res.status(200).json(tweet);
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  },

  async createTweet(req, res) {
    try {
      let tweetData = req.body;
      console.log(req.user);
      tweetData.user = req.user._id;

      let newTweet = await tweetModel.create(tweetData);
      const tweet = await newTweet.save();
      res.status(200).send(tweet)
      } catch (err) {
          console.log(err)
          res.status(400).send(err)
      }
  },

  async updateTweet(req, res) {
    console.log("Updating tweet !");
    const { id } = req.params;
    const { text } = req.body;

    const tweet = await tweetModel.findById(id);

    if (!tweet) {
      res.status(404).json({ error: "Tweet not found" });
      return;
    }

    tweet.text = text;

    await tweet.save();

    res.status(200).json(tweet);
  },

  async deleteTweet(req, res) {
    try{

      console.log("Deleting tweet !");
      const { id } = req.params;
  
      const tweet = await tweetModel.findById(id);
  
      if (tweet === null){
          res.status(400).send("Tweet not found")
      }
      else {
          await tweetModel.deleteOne({ _id: id })
          res.status(200).send("Tweet deleted")
      }
    } catch(err) { 
        console.log(err)
        res.status(400).send(err)
    }
  },
};
