const User = require("../models/user");
const {
  badRequest,
  notFound,
  internalServerError,
} = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(internalServerError)
        .send({ message: "An error has occurred on the server" });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      const error = new Error("User ID not found");
      error.statusCode = notFound;
      throw error;
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.statusCode === notFound) {
        return res.status(notFound).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(badRequest).send({ message: "Invalid data" });
      }
      return res
        .status(internalServerError)
        .json({ message: "An error has occurred on the server" });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(badRequest).send({ message: "Invalid data" });
      }
      return res
        .status(internalServerError)
        .json({ message: "An error has occurred on the server" });
    });
};

module.exports = { getUsers, createUser, getUser };
