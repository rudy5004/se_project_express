const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const {
  validateUserBody, // For signup
  validateAvatarAndName, // For profile updates
} = require("../middlewares/validation");
const {
  getCurrentUser,
  updateCurrentUser,
  createUser, // Assuming this is for signup
} = require("../controllers/users");

// Route for getting the current user info
router.get("/me", auth, getCurrentUser);

// Route for updating the current user's information (name and avatar only)
router.patch("/me", auth, validateAvatarAndName, updateCurrentUser);

// Route for signing up a new user (requires name, avatar, email, and password)
router.post("/signup", validateUserBody, createUser);

module.exports = router;
