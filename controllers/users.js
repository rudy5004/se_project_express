const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");
const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
} = require("../utils/errors");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!email) {
    return next(new BadRequestError("The email field is required"));
  }

  return User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        throw new ConflictError("Duplicate Email: Email already exists");
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
      if (err instanceof ConflictError || err.name === "ValidationError") {
        return next(err);
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Email and password are required"));
  }

  return User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError("Invalid email or password");
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new UnauthorizedError("Invalid email or password");
        }
        return res.send({
          name: user.name,
          avatar: user.avatar,
          _id: user._id,
          email: user.email,
          token: jwt.sign({ _id: user._id }, JWT_SECRET, {
            expiresIn: "7d",
          }),
        });
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data"));
      }
      next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail(() => {
      throw new NotFoundError("User not found");
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => next(err));
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
      throw new NotFoundError("User not found");
    })
    .then((updatedUser) => res.status(200).send(updatedUser))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data"));
      }
      next(err);
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateCurrentUser,
};
