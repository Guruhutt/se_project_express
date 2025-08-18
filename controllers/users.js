const User = require('../models/user');
const { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = require("../utils/errors");

const getUsers =  (req, res) => {
  User.find({})
    .then(users => res.send(users))
    .catch((err) => {console.error(err); return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Internal Server Error' });});
};


const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({name, avatar})
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Bad Request' });
      }
      console.error(err);
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Bad Request' });
    });
};



const getUser = (req, res) => {
  const {userID} = req.params;
  User.findById(userID).orFail().then((user) =>res.status(200).send(user)).catch((err) => {
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
  getUsers, createUser, getUser
};