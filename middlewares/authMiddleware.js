const User = require("../model/authModel");
const jwt = require("jsonwebtoken");

module.exports.checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(
      token,
      process.env.JWT_SECRET_KEY,
      async (err, decodedToken) => {
        if (err) {
          res.status(401).send("{ status: false }");
          next();
        } else {
          const user = await User.findById(decodedToken.id);
          if (user) {
            console.log("middleware user:- ", user, user.username);
            req.user = user;
            // res.json({ status: true, user: user.username});
          }
          else {
            res.status(401).send("{ status: false }");
          }
          next();
        }
      }
    );
  } else {
    res.status(401).send("{ status: false }");
    next();
  }
};
