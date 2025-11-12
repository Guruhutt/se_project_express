require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const indexRouter = require("./routes/index");
const { requestLogger, errorLogger } = require("./middleware/logger");
const { NOT_FOUND } = require("./utils/not_found");
const { INTERNAL_SERVER_ERROR } = require("./utils/internal_error");

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
app.use(
  cors({
    origin: ["http://localhost:3000", "https://www.wtwra.twilightparadox.com"],
  })
);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use(requestLogger);
app.use("/", indexRouter);
app.use((next) => {
  next(new NOT_FOUND("Requested resource not found"));
});

app.use(errorLogger);

// celebrate error handler first
app.use(errors());

// then 404 handler

// then centralized error handler
app.use((err, next) => {
  console.error(err);
  next(new INTERNAL_SERVER_ERROR("An internal server error occurred"));
});

app.listen(PORT, () => {
  console.log("Link to the server:");
  console.log(BASE_PATH);
});
