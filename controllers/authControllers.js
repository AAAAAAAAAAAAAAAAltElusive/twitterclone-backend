const User = require("../model/authModel");
const jwt = require("jsonwebtoken");
const followersModel = require('../model/followersModel')

const maxAge = 2 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: maxAge,
  });
};

const handleErrors = (err) => {
  let errors = { username: "", password: "" };

  console.log(err);
  if (err.message === "incorrect username") {
    errors.username = "That username is not registered";
  }

  if (err.message === "incorrect password") {
    errors.password = "That password is incorrect";
  }

  if (err.code === 11000) {
    errors.username = "Username is already registered";
    return errors;
  }

  if (err.message.includes("Users validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

module.exports.register = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    console.log(username)
    console.log(password)
    const user = await User.create({ username, password});
    const token = createToken(user._id);

    res.cookie("jwt", token, {
      withCredentials: true,
      httpOnly: false,
      maxAge: maxAge * 1000,
    });

    res.status(201).json({ user: user._id, created: true });
  } catch (err) {
    console.log(err);
    const errors = handleErrors(err);
    res.json({ errors, created: false });
  }
};

module.exports.login = async (req, res) => {
  const { username, password} = req.body;
  try {
    const user = await User.login(username, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: false, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id, status: true });
  } catch (err) {
    const errors = handleErrors(err);
    res.json({ errors, status: false });
  }
};

module.exports.logoutUser = async (req, res) => {
  try {
      res.clearCookie('token', { httpOnly: true })
      res.status(200).send("Logout Successfull")
  } catch (err) {
      console.log(err)
      return res.status(400).json(err)
  }
}

module.exports.getAllUsers = async (req, res) => {
  try {
      const userId = req.user._id;
      const followed = await followersModel
          .find({ followerUserId: userId })
          .select('followingUserId -_id');

      const followedIds = followed.map(result => result.followingUserId);
      followedIds.push(userId)
      
      console.log(followedIds)

      const users = await User.find({ _id: { $nin: followedIds } }).select('username')
      console.log(users)
      res.status(200).json(users)
  } catch (err) {
      console.log(err)
      return res.status(400).json(err)
  }
}
