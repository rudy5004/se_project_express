// Importing the Express Router to define route handlers for clothing items.
// The Router allows grouping the related routes, making the code modular and organized.
const router = require("express").Router();

// Importing the `auth` middleware to protect certain routes.
// The `auth` middleware ensures that only authenticated users can access specific routes by verifying their JWT token.
const { auth } = require("../middlewares/auth");

// Importing controller functions from the clothingItems controller.
// These functions handle various operations related to clothing items, such as getting items, creating new items, deleting items, liking, and disliking items.
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  disLikeItem,
} = require("../controllers/clothingItems");

// Defining a route to get all clothing items.
// This route is publicly accessible (no authentication required).
// When a GET request is made to the root path ("/"), the `getItems` function is called to retrieve the list of items.
router.get("/", getItems);

// Defining a route to create a new clothing item.
// This route is protected by the `auth` middleware, meaning only authenticated users can create items.
// The `createItem` function is called to handle the creation when a POST request is made to the root path ("/").
router.post("/", auth, createItem);

// Defining a route to delete a clothing item by its ID.
// This route is also protected by the `auth` middleware, allowing only authenticated users to delete items.
// The `deleteItem` function is called when a DELETE request is made to the path "/:itemId", where `:itemId` is a dynamic parameter representing the ID of the item.
router.delete("/:itemId", auth, deleteItem);

// Defining a route to like a clothing item by its ID.
// This route is protected by the `auth` middleware, so only authenticated users can like items.
// The `likeItem` function is called when a PUT request is made to the path "/:itemId/likes", where `:itemId` represents the ID of the item.
router.put("/:itemId/likes", auth, likeItem);

// Defining a route to dislike (remove a like) from a clothing item by its ID.
// This route is protected by the `auth` middleware, allowing only authenticated users to dislike items.
// The `disLikeItem` function is called when a DELETE request is made to the path "/:itemId/likes", where `:itemId` is the ID of the item.
router.delete("/:itemId/likes", auth, disLikeItem);

// Exporting the router object so it can be used in other parts of the application, typically in the main app file to handle clothing item-related routes.
module.exports = router;
