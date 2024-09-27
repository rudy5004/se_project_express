const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const {
  validateAvatarAndName, // For profile updates
} = require("../middlewares/validation");
const { getCurrentUser, updateCurrentUser } = require("../controllers/users");

// Route for getting the current user info
router.get("/me", auth, getCurrentUser);

// Route for updating the current user's information (name and avatar only)
router.patch("/me", auth, validateAvatarAndName, updateCurrentUser);

module.exports = router;
