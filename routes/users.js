const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const { validateUserBody } = require("../middlewares/validation");
const { getCurrentUser } = require("../controllers/users");

// Route for getting the current user info
router.get("/me", auth, getCurrentUser);

// Route for updating the current user's information
router.patch("/me", auth, validateUserBody);

module.exports = router;
