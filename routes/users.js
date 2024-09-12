// Importing the Express Router to define route handlers.
// The Router is used to manage user-related routes and group them together.
const router = require("express").Router();

// Importing the `auth` middleware to protect routes.
// The `auth` middleware ensures that only authenticated users can access the routes by verifying their JWT token.
const { auth } = require("../middlewares/auth");

// Importing the controller functions that handle user-related operations.
// - `getCurrentUser`: Fetches the current authenticated user's details.
// - `updateCurrentUser`: Updates the current authenticated user's profile information (name, avatar).
const { getCurrentUser, updateCurrentUser } = require("../controllers/users");

// Applying the `auth` middleware to all routes in this router.
// This ensures that every route defined in this file requires the user to be authenticated before proceeding.
router.use(auth);

// Defining a route to get the current user's information.
// When a GET request is made to "/me", the `getCurrentUser` function is called to retrieve the authenticated user's details.
router.get("/me", getCurrentUser);

// Defining a route to update the current user's profile (name, avatar).
// When a PATCH request is made to "/me", the `updateCurrentUser` function is called to update the user's profile details.
router.patch("/me", updateCurrentUser);

// Exporting the `router` so that it can be used in other parts of the application, typically in the main app file to handle user-related routes.
module.exports = router;
