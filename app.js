const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");
const { login, createUser } = require("./controllers/users");
const errorHandler = require("./middlewares/errorHandler"); // Import the error handler
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");

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

app.post("/signin", login);
app.post("/signup", createUser);

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
