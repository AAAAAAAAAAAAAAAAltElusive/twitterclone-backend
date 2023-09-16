const express = require("express");
const router = express.Router();

const followersModel = require("../model/followersModel");
const tweetModel = require("../model/tweetModel");

module.exports = {
  // Get list of followers
  async getFollowers(req, res) {
    console.log("Entered here")
    const user = req.user;
    console.log(user)

    const followers = await followersModel.find({ followingUserId: user.id });
    
    // console.log(followers)
    // If the user has no followers, return an empty array.
    if (!followers) {
      res.json([]);
      return;
    }

    res.json(followers);
  },
  // Get list of following
  async getFollowing(req, res) {
    const user = req.user;
    console.log(user)
    const following = await followersModel.find({ followerUserId: user.id }).select('followingUserId -_id').populate('followingUserId', );

    const followedIds = following.map(result => result.followingUserId);
    // If the user is not following anyone, return an empty array.
    if (!following) {
      res.json([]);
      return;
    }

    res.json(followedIds);
  },

  //Gte tweets from following userIds
  async getTimeline(req, res) {
    const user = req.user;
    // console.log("user:- ", user);
    console.log(user)
    const followedUsers = await followersModel.find({ followerUserId: user.id });
    const tweetIds = followedUsers.map((user) => user.followingUserId);
    
    const tweets = await tweetModel.find({ user: { $in: tweetIds } });
    // Sort the tweets by their createdAt field in descending order.
    tweets.sort((a, b) => b.createdAt - a.createdAt);
    
    console.log("tweets:- ", tweets);
    res.status(201).send(tweets);
  },


  async follow(req, res) {
    console.log("Entered here")
    const { userId } = req.params;

    const user = req.user;

    const follower = await followersModel.findOne({
      followerUserId: user.id,
      followingUserId: userId,
    });

    if (follower) {
      res.status(400).json({ error: "You are already following this user" });
      return;
    }

    const newFollower = new followersModel({
      followerUserId: user.id,
      followingUserId: userId,
    });

    await newFollower.save();

    res.status(201).json(newFollower);
  },

  async unfollow(req, res) {
    const user = req.user;
    const { userId } = req.params;
  
    const follower = await followersModel.findOne({
      followerUserId: user.id,
      followingUserId: userId,
    });
  
    if (!follower) {
      res.status(400).json({ error: "You are not following this user" });
      return;
    }

    await followersModel.deleteOne({
      followerUserId: user.id,
      followingUserId: userId,
    });
  
    res.status(200).send("Unfollow successfull")
  },
  
};
