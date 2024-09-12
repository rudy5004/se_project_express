// Importing the ClothingItem model from the models directory. This model interacts with the 'clothingItem' collection in the MongoDB database.
const ClothingItem = require("../models/clothingItem");

// Importing error constants from the utils/errors module. These constants represent common HTTP status codes used for error handling in API responses:
// - badRequest (400): Used for handling client-side input validation errors.
// - notFound (404): Used when a requested resource (like a clothing item) is not found in the database.
// - internalServerError (500): Used for unexpected server-side errors.
// - forbidden (403): Used when a user attempts to perform an action they are not authorized to perform (e.g., deleting an item they don’t own).
const {
  badRequest,
  notFound,
  internalServerError,
  forbidden,
} = require("../utils/errors");

// This function retrieves all clothing items from the database.
// It uses the ClothingItem model's find method to get all items and sends them back with a status of 200 (OK).
// If an error occurs (e.g., database failure), it catches the error, logs it, and responds with a 500 (Internal Server Error) and an appropriate message.
const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      res
        .status(internalServerError)
        .send({ message: "An error has occurred on the server" });
    });
};

// This function creates a new clothing item based on the request body (name, weather, imageUrl).
// The owner of the item is set to the current user's ID, obtained from req.user._id.
// If the creation is successful, it responds with status 201 (Created) and the new item.
// If there is a validation error (e.g., invalid input), it responds with a 400 (Bad Request) status.
// If another server error occurs, it responds with a 500 (Internal Server Error) and logs the error.
const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(badRequest).send({ message: "Invalid data" });
      }
      return res
        .status(internalServerError)
        .send({ message: "An error has occurred on the server" });
    });
};

// This function deletes a clothing item by its ID, provided as a URL parameter (itemId).
// It first checks if the item exists in the database using findById.
// If the item is not found, it throws a custom error with a 404 (Not Found) status.
// If the current user (req.user._id) is not the owner of the item, it responds with a 403 (Forbidden) status.
// If the user is authorized and the item is found, it deletes the item and responds with a success message.
// If any errors occur, such as invalid data or a server error, it responds with the appropriate status code.
const deleteItem = (req, res) => {
  const { itemId } = req.params;
  const currentUserId = req.user._id;

  ClothingItem.findById(itemId)
    .orFail(() => {
      const error = new Error("Item ID not found");
      error.statusCode = notFound;
      throw error;
    })
    .then((item) => {
      if (item.owner.toString() !== currentUserId) {
        return res
          .status(forbidden)
          .send({ message: "Forbidden: You can only delete your own items" });
      }
      return ClothingItem.findByIdAndRemove(itemId).then(() =>
        res.status(200).send({ message: "Item successfully deleted" })
      );
    })
    .catch((err) => {
      console.error(err);
      if (err.statusCode === notFound)
        return res.status(notFound).send({ message: err.message });
      if (err.name === "CastError" || err.name === "ValidationError")
        return res.status(badRequest).send({ message: "Invalid data" });
      return res
        .status(internalServerError)
        .json({ message: "An error has occurred on the server" });
    });
};

// This function removes a user's like from a clothing item by its ID (itemId).
// It uses the findByIdAndUpdate method to remove the user's ID from the item's likes array.
// If the item is not found, it throws a 404 (Not Found) error.
// If the operation is successful, it responds with a message confirming that the item was disliked.
// It handles any validation or server errors by returning the appropriate status code and message.
const disLikeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error("Item ID not found");
      error.statusCode = notFound;
      throw error;
    })
    .then(() => res.status(200).send({ message: "Item successfully disliked" }))
    .catch((err) => {
      console.error(err);
      if (err.statusCode === notFound)
        return res.status(notFound).send({ message: err.message });
      if (err.name === "CastError" || err.name === "ValidationError")
        return res.status(badRequest).send({ message: "Invalid data" });
      return res
        .status(internalServerError)
        .json({ message: "An error has occurred on the server" });
    });

// This function adds a like to a clothing item by its ID (itemId).
// It uses the findByIdAndUpdate method to add the user's ID to the item's likes array.
// If the item is not found, it throws a 404 (Not Found) error.
// If the operation is successful, it responds with a message confirming that the item was liked.
// It handles any validation or server errors by returning the appropriate status code and message.
const likeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error("Item ID not found");
      error.statusCode = notFound;
      throw error;
    })
    .then(() => res.status(200).send({ message: "Item successfully liked" }))
    .catch((err) => {
      console.error(err);
      if (err.statusCode === notFound)
        return res.status(notFound).send({ message: err.message });
      if (err.name === "CastError" || err.name === "ValidationError")
        return res.status(badRequest).send({ message: "Invalid data" });
      return res
        .status(internalServerError)
        .json({ message: "An error has occurred on the server" });
    });

// Exporting the getItems, createItem, deleteItem, disLikeItem, and likeItem functions so they can be used in other parts of the project, typically in route handlers.
module.exports = { getItems, createItem, deleteItem, disLikeItem, likeItem };
