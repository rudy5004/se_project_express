const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "The name field is required"],
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    validate: {
      validator(value) {
        return !value || validator.isURL(value); // Allows empty values or valid URLs.
      },
      message: "You must enter a valid URL", // Custom error message if the URL is invalid.
    },
    default: "", // Default to an empty string if no avatar is provided.
  },
  email: {
    type: String,
    required: [true, "The email field is required"],
    unique: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: "You must enter a valid email",
    },
  },
  password: {
    type: String,
    required: [true, "The password field is required"],
  },
});

module.exports = mongoose.model("user", userSchema);
