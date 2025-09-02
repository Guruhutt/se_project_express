const express = require('express');
const mongoose = require('mongoose');
const indexRouter = require('./routes/index');
const userRouter = require('./routes/users');
const { NOT_FOUND } = require("./utils/errors");
const cors = require("cors");


const app = express();
const { PORT = 3001 } = process.env;
const BASE_PATH = `http://localhost:${PORT}`;

mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db').then(() => {
  console.log('Connected to DB');}).catch(console.error);
app.use(express.json());
app.use('/', indexRouter);
app.use('/', userRouter);
app.use(cors());

app.use((req, res) => {
  res.status(NOT_FOUND).json({ message: "Requested resource not found" });
});

app.listen(PORT, () => {
  console.log('Link to the server:');
  console.log(BASE_PATH);
});