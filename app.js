require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const mainRouter = require("./routes/index");
const { login, createUser } = require("./controllers/users");
const errorHandler = require("./middlewares/errorHandler"); // Import the error handler
const { requestLogger, errorLogger } = require("./middlewares/logger");
const {
  validateLoginBody,
  validateUserBody,
} = require("./middlewares/validation");
const app = express();
const { PORT = 3001 } = process.env;

app.use(cors());

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((e) => console.error(e));

app.use(express.json());

// Enable the request logger before routes
app.use(requestLogger);

// SignIn and SignUp routes (with validation middleware)
app.post("/signin", validateLoginBody, login);
app.post("/signup", validateUserBody, createUser);

// Main router for other routes
app.use("/", mainRouter);

// Enable the error logger after routes, before the error handlers
app.use(errorLogger);

// Celebrate error handler for handling validation errors
app.use(errors());

// Centralized error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
