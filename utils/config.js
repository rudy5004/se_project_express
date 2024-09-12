// Defining the `JWT_SECRET` constant, which is used to sign and verify JWT tokens for authentication.
// It pulls the value from the environment variable `JWT_SECRET`. If no value is provided (e.g., in development mode), it defaults to "dev-secret".
// In production, it’s crucial to use a strong, secure secret key for JWT to prevent unauthorized access.
const JWT_SECRET = "a secret key random";

// Exporting the `JWT_SECRET` constant so it can be used throughout the application, particularly in authentication processes such as signing and verifying JWT tokens.
module.exports = { JWT_SECRET };
