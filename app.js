const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const { login, createUser } = require("./controllers/users");
const { auth } = require("./middlewares/auth");
const cors = require("cors");

const app = express();
const { PORT = 3001 } = process.env;
app.use(cors());

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((e) => console.error(e));

app.use(express.json());

// Public routes (no authentication required)
app.post("/signin", login);
app.post("/signup", createUser);

// Apply authentication middleware to all subsequent routes
app.use(auth);

// Private routes (authentication required)
app.use("/", mainRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
