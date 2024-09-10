const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");
const {
  badRequest,
  notAuthorized,
  notFound,
  internalServerError,
  duplicateError,
} = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(internalServerError)
        .send({ message: "An error has occurred on the server" });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  return User.findById(userId)
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
  const { name, avatar, email, password } = req.body;

  if (!email) {
    return res
      .status(badRequest)
      .send({ message: "The email field is required" });
  }

  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        const error = new Error("Duplicate Email: Email already exists");
        error.statusCode = duplicateError;
        throw error;
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => {
      return User.create({
        name,
        avatar,
        email,
        password: hash,
      });
    })
    .then((user) => {
      const userObj = user.toObject();
      delete userObj.password;
      return res.status(201).send(userObj);
    })
    .catch((err) => {
      console.error(err);
      if (err.statusCode === duplicateError) {
        return res.status(duplicateError).send({ message: "Duplicate Emails" });
      }
      if (err.name === "ValidationError") {
        return res.status(badRequest).send({ message: "Invalid data" });
      }
      return res
        .status(internalServerError)
        .json({ message: "An error has occurred on the server" });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(badRequest)
      .send({ message: "Email and password are required" });
  }

  return User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return res
          .status(notAuthorized)
          .send({ message: "Invalid email or password" });
      }
      return bcrypt
        .compare(password, user.password)
        .then((matched) =>
          !matched
            ? res
                .status(notAuthorized)
                .send({ message: "Invalid email or password" })
            : res.send({
                token: jwt.sign({ _id: user._id }, JWT_SECRET, {
                  expiresIn: "7d",
                }),
              })
        );
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(badRequest).send({ message: "Invalid data" });
      }
      console.error(err);
      return res
        .status(internalServerError)
        .send({ message: "An error occurred on the server" });
    });
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail(() => {
      const error = new Error("User not found");
      error.statusCode = notFound;
      throw error;
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.statusCode === notFound) {
        return res.status(notFound).send({ message: err.message });
      }
      return res
        .status(internalServerError)
        .send({ message: "An error has occurred on the server" });
    });
};

const updateCurrentUser = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      const error = new Error("User not found");
      error.statusCode = notFound;
      throw error;
    })
    .then((updatedUser) => res.status(200).send(updatedUser))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(badRequest).send({ message: "Invalid data" });
      }
      if (err.statusCode === notFound) {
        return res.status(notFound).send({ message: "User not found" });
      }
      return res
        .status(internalServerError)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = {
  getUsers,
  createUser,
  getUser,
  login,
  getCurrentUser,
  updateCurrentUser,
};
