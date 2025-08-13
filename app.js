const express = require('express');
const mongoose = require('mongoose');
const indexRouter = require('./routes/index');

const app = express();
const { PORT = 3001 } = process.env;
const BASE_PATH = `http://localhost:${PORT}`;

mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db').then(() => {
  console.log('Connected to DB');}).catch(console.error);



app.use((req, res, next) => {
  req.user = {
    _id: '689bec0e616896ffff4a5136'// paste the _id of the test user created in the previous step
  };
  next();
});

app.use(express.json());
app.use('/', indexRouter);

module.exports.createClothingItem = (req, res) => {
  console.log(req.user._id);// _id will become accessible
};

app.listen(PORT, () => {
  console.log('Link to the server:');
  console.log(BASE_PATH);
});