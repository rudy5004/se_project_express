const router = require("express").Router();
const { notFound } = require("../utils/errors");
const itemRouter = require("./clothingItems");
const userRouter = require("./users");

// Route for item-related endpoints
router.use("/items", itemRouter);

// Route for user-related endpoints
router.use("/users", userRouter);

// Fallback for all other routes (404 Not Found)
router.use((req, res) => {
  res.status(notFound).json({ message: "Requested resource not found" });
});

module.exports = router;
