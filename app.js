require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const indexRouter = require("./routes/index");
const { requestLogger, errorLogger } = require("./middleware/logger");
const { errors } = require("celebrate");
const { NOT_FOUND, INTERNAL_SERVER_ERROR } = require("./utils/errors");

const app = express();
const { PORT = 3001 } = process.env;
const BASE_PATH = `http://localhost:${PORT}`;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(express.json());
app.use(cors());
app.use(requestLogger);
app.use("/", indexRouter);

app.use(errorLogger);

// celebrate error handler first
app.use(errors());

// then 404 handler
app.use((req, res) => {
  res.status(NOT_FOUND).json({ message: "Requested resource not found" });
});

// then centralized error handler
app.use((err, req, res, next) => {
  console.error(err);
  return res
    .status(INTERNAL_SERVER_ERROR)
    .send({ message: "An error occurred on the server" });
});

app.listen(PORT, () => {
  console.log("Link to the server:");
  console.log(BASE_PATH);
});
