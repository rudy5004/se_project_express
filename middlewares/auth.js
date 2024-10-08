// Importing jsonwebtoken (JWT) library to verify and decode the JWT tokens for user authentication.
const jwt = require("jsonwebtoken");

// Importing the error constant `UnauthorizedError` from the utils/errors module.
// - UnauthorizedError (401): Used when the user is not authorized to access a resource, typically due to missing or invalid authorization credentials.
const { UnauthorizedError } = require("../utils/errors/index");

// Importing the secret key used to sign and verify JWT tokens from the config file.
const { JWT_SECRET } = require("../utils/config");

// This middleware function is responsible for checking the authorization header in incoming requests.
// It ensures that the request contains a valid JWT token and verifies it to authenticate the user.
const auth = (req, res, next) => {
  const { authorization } = req.headers; // Extracting the 'authorization' header from the request.

  // If the 'authorization' header is missing or doesn't start with "Bearer ", the request is unauthorized.
  // Pass the error to the error handling middleware using next().
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Authorization Required"));
  }

  // Removing the "Bearer " prefix to extract the actual JWT token from the authorization header.
  const token = authorization.replace("Bearer ", "");
  let payload;

  // Verifying the JWT token using the secret key (JWT_SECRET).
  // If verification fails (e.g., the token is invalid or expired), pass the error to the error handler.
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError("Authorization Required"));
  }

  // If the token is successfully verified, the user data (payload) is attached to the request object (req.user).
  // This allows the authenticated user's data to be accessed in subsequent route handlers.
  req.user = payload;

  // Calling the `next()` function to pass control to the next middleware or route handler in the stack.
  return next();
};

// Exporting the `auth` middleware function so it can be used to protect routes that require user authentication.
module.exports = { auth };
