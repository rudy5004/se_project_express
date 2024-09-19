const ClothingItem = require("../models/clothingItem");
const {
  BadRequestError, // Changed from badRequestError to BadRequestError (capitalized for consistency with the class name).
  NotFoundError, // Changed from NotFoundError (correct use of error class).
  InternalServerError, // Changed from internalServerError to InternalServerError (correct usage as error class, capitalized).
  ForbiddenError, // Changed from ForbiddenError (correct use of error class).
} = require("../utils/errors");

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => next(err)); // No changes here, errors are passed directly to the middleware.
};

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        // Changed the error handling from assigning a status code to creating a new instance of the BadRequestError.
        next(new BadRequestError("Invalid data")); // Use the custom BadRequestError class here.
      } else {
        next(err); // Pass other errors to the middleware.
      }
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const currentUserId = req.user._id;

  ClothingItem.findById(itemId)
    .orFail(() => {
      // Replaced manually constructing an error object with a custom NotFoundError.
      throw new NotFoundError("Item ID not found"); // Use NotFoundError for 404.
    })
    .then((item) => {
      if (item.owner.toString() !== currentUserId) {
        // Replaced manually constructing an error object with a custom ForbiddenError.
        throw new ForbiddenError("You can only delete your own items"); // Use ForbiddenError for 403.
      }
      return ClothingItem.findByIdAndRemove(itemId).then(() =>
        res.status(200).send({ message: "Item successfully deleted" })
      );
    })
    .catch((err) => next(err)); // Pass the error to the next() middleware
};

const disLikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      // Replaced manually constructing an error object with a custom NotFoundError.
      throw new NotFoundError("Item ID not found"); // Use NotFoundError for 404.
    })
    .then(() => res.status(200).send({ message: "Item successfully disliked" }))
    .catch((err) => next(err)); // Pass the error to the next() middleware
};

const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      // Replaced manually constructing an error object with a custom NotFoundError.
      throw new NotFoundError("Item ID not found"); // Use NotFoundError for 404.
    })
    .then(() => res.status(200).send({ message: "Item successfully liked" }))
    .catch((err) => next(err)); // Pass the error to the next() middleware
};

module.exports = { getItems, createItem, deleteItem, disLikeItem, likeItem };
