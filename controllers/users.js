const User = require('../models/user');
const { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR, CONFLICT} = require("../utils/errors");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const getUsers =  (req, res) => {
  User.find({})
    .then(users => res.send(users))
    .catch((err) => {console.error(err); return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Internal Server Error' });});
};

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(401)
        .send({ message: err.message });
    });
};

const createUser = (req, res) => {
  const { name, avatar, password, email } = req.body;
   bcrypt.hash(password, 10).then((hash) =>User.create({name, avatar , email,
      password: hash}))
    .then((user) => {
      const userObj = user.toObject();
      delete userObj.password;
      res.status(201).send(user)})
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Bad Request' });
      }
      if (err.code === 11000) {
        return res.status(CONFLICT).send({ message: 'Email already exists' });
      }
      console.error(err);
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Bad Request' });
    });
};

const getCurrentUser = (req, res) => {
  const {userMe} = req.user._id;
  User.findById(userMe).orFail().then((user) =>res.status(200).send(user)).catch((err) => {
      console.error(err);
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Bad Request' });
      } if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: 'Not Found' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Bad Request' });
    });
};

const updateUser = (req, res) => {
  const { name, avatar } = req.body;
  const { userMe } = req.user._id;

  User.findByIdAndUpdate(userMe, { name, avatar }, { new: true, runValidators: true }).orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Bad Request' });
      } if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: 'Not Found' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Bad Request' });
    });
};

module.exports = {
  getUsers, createUser, getCurrentUser , login ,updateUser
};