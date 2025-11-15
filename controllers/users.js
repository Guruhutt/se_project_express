const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const BAD_REQUEST = require("../utils/bad_request");
const NOT_FOUND = require("../utils/not_found");
const INTERNAL_SERVER_ERROR = require("../utils/internal_error");
const UnauthorizedError = require("../utils/unauthorized");
const CONFLICT = require("../utils/conflict");

const { JWT_SECRET } = require("../config");

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => {
      next(new INTERNAL_SERVER_ERROR("Internal Server Error"));
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BAD_REQUEST("Email and password are required"));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        return next(new UnauthorizedError("Incorrect email or password"));
      }
      return next(new INTERNAL_SERVER_ERROR("Internal Server Error"));
    });
};

const createUser = (req, res, next) => {
  const { name, avatar, password, email } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const userObj = user.toObject();
      delete userObj.password;
      res.status(201).send(userObj);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BAD_REQUEST("Bad Request"));
      }
      if (err.code === 11000) {
        return next(new CONFLICT("User with this email already exists"));
      }
      console.error(err);
      return next(new INTERNAL_SERVER_ERROR("Internal Server Error"));
    });
};

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return next(new BAD_REQUEST("Bad Request"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NOT_FOUND("User not found"));
      }
      return next(new INTERNAL_SERVER_ERROR("Internal Server Error"));
    });
};

const updateUser = (req, res, next) => {
  const { name, avatar } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(
    _id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return next(new BAD_REQUEST("Bad Request"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NOT_FOUND("User not found"));
      }
      return next(new INTERNAL_SERVER_ERROR("Internal Server Error"));
    });
};

module.exports = {
  getUsers,
  createUser,
  getCurrentUser,
  login,
  updateUser,
};
