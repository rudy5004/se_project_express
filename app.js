const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const mainRouter = require("./routes/index");
const { login, createUser } = require("./controllers/users");
const errorHandler = require("./middlewares/errorHandler");
//added at end for validation
const { validateUserInfo, validateLogin } = require("./middlewares/validation");

// Import the loggers (requestLogger and errorLogger)
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();
const { PORT = 3001 } = process.env;

// Enable CORS
app.use(cors());

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((e) => console.error(e));

// Use request logger before routes to log all incoming requests
app.use(requestLogger); // <-- This logs all incoming requests

// Parse incoming JSON requests
app.use(express.json());

// Authentication routes
app.post("/signin", validateLogin, login);
app.post("/signup", validateUserInfo, createUser);

// Main application routes
app.use("/", mainRouter);

// Celebrate validation error handler
app.use(errors());

// Use error logger after routes to log all errors
app.use(errorLogger); // <-- This logs any errors that occur during the request

// Centralized error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
