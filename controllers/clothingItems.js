const ClothingItem = require("../models/clothingItem");
const {
  badRequest,
  notFound,
  internalServerError,
} = require("../utils/errors");

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      res.status(internalServerError).send({ message: err.message });
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      res.status(badRequest).send({ message: err.message });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findById(itemId)
    .orFail(() => {
      const error = new Error("Item ID not found");
      error.statusCode = notFound;
      throw error;
    })
    .then(() => ClothingItem.findByIdAndRemove(itemId))
    .then(() => res.status(200).send({ message: "Item successfully deleted" }))
    .catch((err) => {
      console.error(err);
      if (err.statusCode === notFound)
        return res.status(notFound).send({ message: err.message });
      if (err.name === "CastError")
        return res.status(badRequest).send({ message: err.message });
      res.status(internalServerError).json({ message: err.message });
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
      if (err.name === "CastError")
        return res.status(badRequest).send({ message: err.message });
      res.status(internalServerError).json({ message: err.message });
    });
//likeItem,

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
      if (err.name === "CastError")
        return res.status(badRequest).send({ message: err.message });
      res.status(internalServerError).json({ message: err.message });
    });

module.exports = { getItems, createItem, deleteItem, disLikeItem, likeItem };
