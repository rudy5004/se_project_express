const User = require("../models/user");
//const errorHandler = require("../utils/errors");
const {
  badRequest,
  notFound,
  internalServerError,
} = require("../utils/errors");

//GET /users

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      console.error(err);
      return res.status(internalServerError).send({ message: err.message });
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
      } else if (err.name === "CastError") {
        return res.status(badRequest).send({ message: err.message });
      }
      res.status(internalServerError).json({ message: err.message });
    });
};

//POST /users

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(badRequest).send({ message: err.message });
      }
      res.status(internalServerError).json({ message: err.message });
    });
};

module.exports = { getUsers, createUser, getUser };
