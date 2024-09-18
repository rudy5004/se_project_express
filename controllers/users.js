// Importing bcryptjs for hashing passwords and comparing hashed passwords for authentication.
const bcrypt = require("bcryptjs");

// Importing jsonwebtoken for creating and verifying JWT (JSON Web Token) tokens for user authentication.
const jwt = require("jsonwebtoken");

// Importing the secret key for JWT token signing from the config file.
const { JWT_SECRET } = require("../utils/config");

// Importing the User model for interacting with the 'user' collection in the MongoDB database.
const User = require("../models/user");

// Importing error constants from the utils/errors module. These represent common HTTP status codes used in error handling:
// - badRequest (400): Client-side input validation errors.
// - notAuthorized (401): For handling unauthorized access, e.g., invalid login credentials.
// - notFound (404): When a requested resource, such as a user, cannot be found.
// - internalServerError (500): Unexpected server-side errors.
// - duplicateError (409): Conflict errors, such as duplicate email registration.
const {
  badRequest,
  notAuthorized,
  notFound,
  internalServerError,
  duplicateError,
} = require("../utils/errors");

// This function handles creating a new user account.
// It expects `name`, `avatar`, `email`, and `password` in the request body.
// If the email is already registered, it throws a duplicate error (409 Conflict).
// It hashes the password before storing the user details in the database.
// After successfully creating the user, it removes the password field from the response object and returns the user with a 201 status (Created).
// If validation fails or any server error occurs, the function responds with the appropriate error status.
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email) {
    return res
      .status(badRequest) // Responds with a 400 (Bad Request) if the email field is missing.
      .send({ message: "The email field is required" });
  }

  return User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        const error = new Error("Duplicate Email: Email already exists");
        error.statusCode = duplicateError;
        throw error; // Throws a duplicate error if the email is already in use.
      }
      return bcrypt.hash(password, 10); // Hashes the user's password before saving it in the database.
    })
    .then((hash) =>
      User.create({
        name,
        avatar,
        email,
        password: hash, // Saves the hashed password.
      })
    )
    .then((user) => {
      const userObj = user.toObject();
      delete userObj.password; // Removes the password from the user object before sending the response.
      return res.status(201).send(userObj); // Responds with the new user and status 201 (Created).
    })
    .catch((err) => {
      console.error(err);
      if (err.statusCode === duplicateError) {
        return res.status(duplicateError).send({ message: "Duplicate Emails" }); // Handles duplicate email error (409 Conflict).
      }
      if (err.name === "ValidationError") {
        return res.status(badRequest).send({ message: "Invalid data" }); // Handles invalid input data error (400 Bad Request).
      }
      return res
        .status(internalServerError) // Handles server errors with status 500 (Internal Server Error).
        .json({ message: "An error has occurred on the server" });
    });
};

// This function handles user login.
// It expects an `email` and `password` in the request body.
// If the credentials are valid, it generates a JWT token and responds with it.
// If the email or password is incorrect, it responds with a 401 (Unauthorized) error.
// If validation or server errors occur, the function returns the appropriate error status.
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(badRequest) // Responds with a 400 (Bad Request) if email or password is missing.
      .send({ message: "Email and password are required" });
  }

  return User.findOne({ email })
    .select("+password") // Selects the user's password field, which is not selected by default.
    .then((user) => {
      if (!user) {
        return res
          .status(notAuthorized) // Responds with a 401 (Unauthorized) if the user is not found.
          .send({ message: "Invalid email or password" });
      }
      return bcrypt.compare(password, user.password).then((matched) =>
        !matched
          ? res
              .status(notAuthorized) // Responds with a 401 (Unauthorized) if the password does not match.
              .send({ message: "Invalid email or password" })
          : res.send({
              name: user.name,
              avatar: user.avatar,
              _id: user._id,
              email: user.email,
              token: jwt.sign({ _id: user._id }, JWT_SECRET, {
                expiresIn: "7d", // Creates a JWT token that expires in 7 days.
              }),
            })
      );
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(badRequest).send({ message: "Invalid data" }); // Handles validation errors with a 400 (Bad Request).
      }
      console.error(err);
      return res
        .status(internalServerError) // Handles server errors with a 500 (Internal Server Error).
        .send({ message: "An error occurred on the server" });
    });
};

// This function retrieves the currently logged-in user's data.
// It uses the user's ID from the JWT token (req.user._id) to find the user in the database.
// If the user is not found, it throws a 404 (Not Found) error.
// If successful, it responds with the user object.
// Any errors are caught and handled with the appropriate status code.
const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail(() => {
      const error = new Error("User not found");
      error.statusCode = notFound;
      throw error; // Throws a 404 error if the user is not found.
    })
    .then((user) => res.status(200).send(user)) // Responds with the user's data and a 200 (OK) status.
    .catch((err) => {
      console.error(err);
      if (err.statusCode === notFound) {
        return res.status(notFound).send({ message: err.message }); // Handles 404 errors if the user is not found.
      }
      return res
        .status(internalServerError) // Handles server errors with a 500 (Internal Server Error).
        .send({ message: "An error has occurred on the server" });
    });
};

// This function updates the current user's data (name and avatar).
// It uses the user's ID from the JWT token (req.user._id) to update their information.
// If the user is not found, it throws a 404 (Not Found) error.
// It validates the input fields (name and avatar), and if they are valid, updates the user.
// If validation fails or a server error occurs, it responds with the appropriate status code.
const updateCurrentUser = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, avatar }, // Updates the user's name and avatar fields.
    { new: true, runValidators: true } // Ensures the updated data is validated before being saved and returns the updated document.
  )
    .orFail(() => {
      const error = new Error("User not found");
      error.statusCode = notFound;
      throw error; // Throws a 404 error if the user is not found.
    })
    .then((updatedUser) => res.status(200).send(updatedUser)) // Responds with the updated user and a 200 (OK) status.
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(badRequest).send({ message: "Invalid data" }); // Handles validation errors with a 400 (Bad Request).
      }
      if (err.statusCode === notFound) {
        return res.status(notFound).send({ message: "User not found" }); // Handles 404 errors if the user is not found.
      }
      return res
        .status(internalServerError) // Handles server errors with a 500 (Internal Server Error).
        .send({ message: "An error has occurred on the server" });
    });
};

// Exporting the createUser, login, getCurrentUser, and updateCurrentUser functions so they can be used in other parts of the project, typically in route handlers.
module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateCurrentUser,
};
