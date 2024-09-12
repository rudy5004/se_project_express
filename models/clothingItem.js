// Importing mongoose to create a schema and model for the 'clothingItem' collection in the MongoDB database.
const mongoose = require("mongoose");

// Importing the validator library to validate fields, such as checking if a string is a valid URL.
const validator = require("validator");

// Defining the schema for clothing items.
// This schema outlines the structure and validation rules for each clothing item stored in the database.
const clothingItemSchema = new mongoose.Schema({
  // The 'name' field represents the name of the clothing item.
  // It is a required string with a minimum length of 2 characters and a maximum of 30 characters.
  name: {
    type: String,
    required: [true, "The name field is required"], // Custom error message if the field is missing.
    minlength: 2, // Ensures the name is at least 2 characters long.
    maxlength: 30, // Ensures the name is no longer than 30 characters.
  },

  // The 'weather' field represents the type of weather the clothing item is suited for.
  // It is a required string that can only have one of the following values: "hot", "warm", or "cold".
  weather: {
    type: String,
    required: [true, "The weather field is required"], // Custom error message if the field is missing.
    enum: ["hot", "warm", "cold"], // Enum validator to restrict values to specific options.
  },

  // The 'imageUrl' field stores the URL of the clothing item's image.
  // It is a required string, and the value must be a valid URL format, verified by the 'validator.isURL' method.
  imageUrl: {
    type: String,
    required: [true, "The imageUrl field is required"], // Custom error message if the field is missing.
    validate: {
      validator(value) {
        return validator.isURL(value); // Uses the 'validator' library to ensure the value is a valid URL.
      },
      message: "You must enter a valid URL", // Custom error message if the URL is invalid.
    },
  },

  // The 'owner' field stores a reference to the user who owns the clothing item.
  // It is a MongoDB ObjectId that refers to the 'user' collection.
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "user" },

  // The 'likes' field is an array of ObjectIds referencing users who liked the clothing item.
  // It defaults to an empty array if no likes are present.
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user", default: [] }],

  // The 'createdAt' field stores the timestamp when the clothing item was created.
  // It defaults to the current date and time when the item is added to the database.
  createdAt: { type: Date, default: Date.now },
});

// Exporting the 'clothingItem' model, which is created based on the 'clothingItemSchema'.
// This model is used to interact with the 'clothingItem' collection in MongoDB.
module.exports = mongoose.model("item", clothingItemSchema);
