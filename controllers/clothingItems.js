const ClothingItem = require("../models/clothingItem");
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require("../utils/errors/index");

const getItems = (req, res, next) =>
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => next(err)); // Pass error to centralized handler
const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  return ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data"));
      }
      return next(err);
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const currentUserId = req.user._id;

  return ClothingItem.findById(itemId)
    .orFail(() => {
      throw new NotFoundError("Item ID not found");
    })
    .then((item) => {
      if (item.owner.toString() !== currentUserId) {
        throw new ForbiddenError(
          "Forbidden: You can only delete your own items"
        );
      }
      return ClothingItem.findByIdAndRemove(itemId).then(() =>
        res.status(200).send({ message: "Item successfully deleted" })
      );
    })
    .catch((err) => {
      if (err instanceof NotFoundError || err instanceof ForbiddenError) {
        return next(err);
      }
      if (err.name === "CastError" || err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data"));
      }
      return next(err);
    });
};

const disLikeItem = (req, res, next) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      throw new NotFoundError("Item ID not found");
    })
    .then(() => res.status(200).send({ message: "Item successfully disliked" }))
    .catch((err) => {
      if (err instanceof NotFoundError) {
        return next(err);
      }
      if (err.name === "CastError" || err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data"));
      }
      return next(err);
    });

const likeItem = (req, res, next) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      throw new NotFoundError("Item ID not found");
    })
    .then(() => res.status(200).send({ message: "Item successfully liked" }))
    .catch((err) => {
      if (err instanceof NotFoundError) {
        return next(err);
      }
      if (err.name === "CastError" || err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data"));
      }
      return next(err);
    });

module.exports = { getItems, createItem, deleteItem, disLikeItem, likeItem };
