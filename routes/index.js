const { NotFoundError } = require("../utils/errors");
// Importing the Express Router to define route handlers.
// The Router is used to group and organize routes into different modules for easier management.
const router = require("express").Router();

// Importing the `itemRouter`, which contains all the routes related to clothing items (e.g., creating, deleting, liking items).
const itemRouter = require("./clothingItems");

// Importing the `userRouter`, which contains all the routes related to user operations (e.g., user creation, login, profile management).
const userRouter = require("./users");

// Mounting the `itemRouter` for all routes that start with "/items".
// This directs any requests made to "/items" to be handled by the routes defined in `clothingItems.js`.
router.use("/items", itemRouter);

// Mounting the `userRouter` for all routes that start with "/users".
// This directs any requests made to "/users" to be handled by the routes defined in `users.js`.
router.use("/users", userRouter);

router.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

// Exporting the `router` so that it can be used in other parts of the application, typically in the main app file to handle all routing.
module.exports = router;
