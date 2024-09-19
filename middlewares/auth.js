const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");
const {
  badRequestErrorError,
  UnauthorizedError,
  NotFoundError,
  internalServerError,
  ConflictError,
} = require("../utils/errors");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!email) {
    const error = new Error("The email field is required");
    error.statusCode = badRequestError;
    return next(error);
  }

  return User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        const error = new Error("Duplicate Email: Email already exists");
        error.statusCode = ConflictError;
        throw error;
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) =>
      User.create({
        name,
        avatar,
        email,
        password: hash,
      })
    )
    .then((user) => {
      const userObj = user.toObject();
      delete userObj.password;
      return res.status(201).send(userObj);
    })
    .catch((err) => {
      if (err.statusCode === ConflictError || err.name === "ValidationError") {
        err.statusCode = ConflictError;
        err.message = "Invalid data";
      }
      next(err); // Pass error to the middleware
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = new Error("Email and password are required");
    error.statusCode = badRequestError;
    return next(error);
  }

  return User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        const error = new Error("Invalid email or password");
        error.statusCode = UnauthorizedError;
        throw error;
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          const error = new Error("Invalid email or password");
          error.statusCode = UnauthorizedError;
          throw error;
        }
        return res.send({
          token: jwt.sign({ _id: user._id }, JWT_SECRET, {
            expiresIn: "7d",
          }),
        });
      });
    })
    .catch((err) => next(err)); // Pass error to the middleware
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail(() => {
      const error = new Error("User not found");
      error.statusCode = NotFoundError;
      throw error;
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => next(err)); // Pass error to the middleware
};

const updateCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      const error = new Error("User not found");
      error.statusCode = NotFoundError;
      throw error;
    })
    .then((updatedUser) => res.status(200).send(updatedUser))
    .catch((err) => {
      if (err.name === "ValidationError") {
        err.statusCode = badRequestError;
        err.message = "Invalid data";
      }
      next(err); // Pass error to the middleware
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateCurrentUser,
};
