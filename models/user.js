// Importing mongoose to create a schema and model for the 'user' collection in the MongoDB database.
const mongoose = require("mongoose");

// Importing the validator library to validate fields, such as checking if a string is a valid email or URL.
const validator = require("validator");

// Defining the schema for users.
// This schema outlines the structure and validation rules for each user stored in the database.
const userSchema = new mongoose.Schema({
  // The 'name' field represents the user's name.
  // It is a required string with a minimum length of 2 characters and a maximum length of 30 characters.
  name: {
    type: String,
    required: [true, "The name field is required"], // Custom error message if the field is missing.
    minlength: 2, // Ensures the name is at least 2 characters long.
    maxlength: 30, // Ensures the name is no longer than 30 characters.
  },

  // The 'avatar' field stores the URL of the user's avatar image.
  // It is a required string and must be a valid URL, verified by the 'validator.isURL' method.
  avatar: {
    type: String,
    required: [true, "The avatar field is required"], // Custom error message if the field is missing.
    validate: {
      validator(value) {
        return validator.isURL(value); // Uses the 'validator' library to ensure the value is a valid URL.
      },
      message: "You must enter a valid URL", // Custom error message if the URL is invalid.
    },
  },

  // The 'email' field stores the user's email address.
  // It is a required string and must be unique, meaning no two users can have the same email.
  // The value is validated to ensure it is a properly formatted email address using 'validator.isEmail'.
  email: {
    type: String,
    required: [true, "The email field is required"], // Custom error message if the field is missing.
    unique: true, // Ensures that the email is unique in the database.
    validate: {
      validator(value) {
        return validator.isEmail(value); // Uses the 'validator' library to ensure the value is a valid email.
      },
      message: "You must enter a valid email", // Custom error message if the email is invalid.
    },
  },

  // The 'password' field stores the user's password.
  // It is a required string, but the 'select: false' option means it will not be returned in queries by default.
  // This ensures the password is kept secure and hidden when retrieving user data.
  password: {
    type: String,
    required: [true, "The password field is required"], // Custom error message if the field is missing.
    select: false, // Prevents the password from being included in query results unless explicitly selected.
  },
});

// Exporting the 'user' model, which is created based on the 'userSchema'.
// This model is used to interact with the 'user' collection in MongoDB.
module.exports = mongoose.model("user", userSchema);
