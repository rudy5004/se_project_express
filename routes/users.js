const router = require("express").Router();

const {
  getCurrentUser,
  updateCurrentUser,
  createUser,
  login,
} = require("../controllers/users");

const { auth } = require("../middlewares/auth");

router.post("/signup", createUser);

router.post("/signin", login);

router.get("/me", auth, getCurrentUser);

router.patch("/me", auth, updateCurrentUser);

module.exports = router;
