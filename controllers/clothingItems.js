const ClothingItem = require("../models/clothingItem");
const {
  badRequest,
  notFound,
  internalServerError,
  forbidden,
} = require("../utils/errors");

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
      return ClothingItem.findByIdAndRemove(itemId);
    })
    .then(() => res.status(200).send({ message: "Item successfully deleted" }))
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

module.exports = { getItems, createItem, deleteItem, disLikeItem, likeItem };
