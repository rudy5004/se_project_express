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
    required: [true, "The avatar field is required"], // Avatar is now required
    validate: {
      validator(value) {
        return validator.isURL(value); // Only allows valid URLs, no empty values allowed.
      },
      message: "You must enter a valid URL", // Custom error message if the URL is invalid.
    },
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
    select: false, // Prevents password from being returned in queries
  },
});

module.exports = mongoose.model("user", userSchema);
