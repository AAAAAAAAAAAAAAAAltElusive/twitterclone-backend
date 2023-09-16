const { register, login, logoutUser, getAllUsers } = require("../controllers/authControllers");
const { checkUser } = require("../middlewares/authMiddleware");

const router = require("express").Router();

router.post("/", checkUser); 
router.post("/register", register);
router.post("/login", login);
router.get('/logout', logoutUser)

router.get('/check', checkUser, (req, res) => {
    res.send(req.user._id)
})

router.get('/getAllUsers', checkUser, getAllUsers)

router.get('/getUser', checkUser, (req, res) => {
    res.status(200).json({ userId: req.user._id, username: req.user.username })
})



module.exports = router;
