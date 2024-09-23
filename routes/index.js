// Importing the Express Router to define route handlers.
// The Router is used to group and organize routes into different modules for easier management.
const router = require("express").Router();

// Importing the `NotFoundError` constant from the `errors` module.
// This is used for handling cases where a requested route does not exist, and it represents the HTTP 404 (Not Found) status code.
const { NotFoundError } = require("../utils/errors");

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

// Defining a fallback route handler for any undefined routes (404 Not Found).
// If a request is made to a route that doesn't match any of the above routes, this handler responds with a 404 status and a custom error message.
router.use((req, res) => {
  res.status(NotFoundError).json({ message: "Requested resource not found" });
});

// Exporting the `router` so that it can be used in other parts of the application, typically in the main app file to handle all routing.
module.exports = router;
