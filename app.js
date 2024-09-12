// Importing the `express` library to create an Express application.
// Express is a web framework for Node.js that provides methods for handling HTTP requests, middleware, and more.
const express = require("express");

// Importing the `mongoose` library to interact with MongoDB.
// Mongoose provides a straightforward way to model and manage MongoDB collections and documents.
const mongoose = require("mongoose");

// Importing the `cors` middleware to enable Cross-Origin Resource Sharing.
// This middleware allows the server to handle requests from different domains, which is necessary for making requests to the API from a frontend hosted elsewhere.
const cors = require("cors");

// Importing the `mainRouter` which handles all the defined routes in the `routes/index.js` file.
// This groups routes related to items and users, as well as a fallback route for 404 errors.
const mainRouter = require("./routes/index");

// Importing controller functions `login` and `createUser` from the `users` controller.
// - `login`: Handles user authentication and login requests.
// - `createUser`: Handles user registration (sign-up) requests.
const { login, createUser } = require("./controllers/users");

// Creating an instance of an Express application, which will be used to define routes and middleware.
const app = express();

// Defining the `PORT` constant, which is the port on which the server will listen for incoming requests.
// It retrieves the port number from the environment variable `PORT`. If not provided, it defaults to `3001`.
const { PORT = 3001 } = process.env;

// Using the `cors` middleware in the app to allow cross-origin requests from other domains.
app.use(cors());

// Connecting to the MongoDB database using `mongoose.connect`.
// The connection string "mongodb://127.0.0.1:27017/wtwr_db" points to the local MongoDB server and the database named "wtwr_db".
// Once the connection is established, a success message is logged. If there’s an error, it’s caught and logged to the console.
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((e) => console.error(e));

// Using the `express.json()` middleware to parse incoming JSON requests.
// This middleware allows the app to handle incoming JSON payloads, typically used in API requests.
app.use(express.json());

// Defining a POST route for user sign-in ("/signin"), which is handled by the `login` controller function.
// This route is used for authenticating users and generating a JWT token upon successful login.
app.post("/signin", login);

// Defining a POST route for user sign-up ("/signup"), which is handled by the `createUser` controller function.
// This route is used for registering new users.
app.post("/signup", createUser);

// Defining the root route ("/") to use the `mainRouter`.
// The `mainRouter` groups the routes for managing items, users, and handling 404 errors.
app.use("/", mainRouter);

// Starting the server and making it listen on the specified port (default is 3001).
// Once the server starts, a message is logged to the console indicating that it's running and listening for incoming requests.
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
