const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR, CONFLICT, UNAUTHORIZED} = require("../utils/errors");


const {JWT_SECRET}  = process.env;

const getUsers =  (req, res) => {
  User.find({})
    .then(users => res.send(users))
    .catch((err) => {console.error(err); return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Internal Server Error' });});
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(BAD_REQUEST).send({message: 'Email and password are required' });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token });
    })
    .catch((err) => {
      if (err.message === 'Incorrect email or password') {
        return res.status(UNAUTHORIZED).send({ message: 'Incorrect email or password' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Internal Server Error' });
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
  const {_id} = req.user;
  User.findById(_id).orFail().then((user) =>res.status(200).send(user)).catch((err) => {
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
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, { name, avatar }, { new: true, runValidators: true }).orFail()
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