const { follow, unfollow, getFollowers, getFollowing, getTimeline } = require("../controllers/followersController");
const {checkUser} = require("../middlewares/authMiddleware")
const express = require("express");
const router = express.Router();

router.get("/followers", checkUser, getFollowers);
router.get("/following", checkUser, getFollowing);
router.get("/timeline", checkUser, getTimeline);
router.post("/follow/:userId", checkUser, follow);
router.delete("/unfollow/:userId", checkUser, unfollow);

module.exports = router;
