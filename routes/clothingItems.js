const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  disLikeItem,
} = require("../controllers/clothingItems");

const {
  validateClothingItemBody,
  validateId,
} = require("../middlewares/validation");

// Route to get all clothing items
router.get("/", getItems);

// Route to create a new clothing item (with validation)
router.post("/", auth, validateClothingItemBody, createItem);

// Route to delete a clothing item by ID (with validation)
router.delete("/:itemId", auth, validateId, deleteItem);

// Route to like a clothing item by ID (with validation)
router.put("/:itemId/likes", auth, validateId, likeItem);

// Route to dislike a clothing item by ID (with validation)
router.delete("/:itemId/likes", auth, validateId, disLikeItem);

module.exports = router;
