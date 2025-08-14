const express = require('express');
const Clothing = require('../models/clothing');
const { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = require("../utils/errors");


const getClothingItems = (req, res) => {
  Clothing.find({}).orFail()
    .then(items => res.send(items))
    .catch((err) => {
      console.error(err);
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Internal Server Error' });
    });
};

const createClothingItem = (req, res) => {
  const {  weather, imageUrl, owner } = req.body;
  const clothingItem = new Clothing({ weather, imageUrl, owner });

  Clothing.create({ weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Bad Request' });
      }
      console.error(err);
      return res.status(BAD_REQUEST).send({ message: 'Bad Request' });
    });
};

const deleteClothingItem = (req, res) => {
  const { itemID } = req.params;
  Clothing.findByIdAndDelete(itemID).orFail()
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).send({ message: 'Item not found' });
      }
      res.status(200).send({ message: 'Item deleted successfully' });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Bad Request' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Internal Server Error' });
    });
};

const likeClothingItem = (req, res) => {
  const { itemID } = req.params;
  const userID = req.user._id;
  Clothing.findByIdAndUpdate(
    itemID,
    { $addToSet: { likes: userID } },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Bad Request' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Internal Server Error' });
    });
  };

const dislikeClothingItem = (req, res) => {
  const { itemID } = req.params;
  const userID = req.user._id;
  Clothing.findByIdAndUpdate(
    itemID,
    { $pull: { likes: userID } },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Bad Request' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Internal Server Error' });
    }
  );
};

module.exports = {
  getClothingItems, createClothingItem, deleteClothingItem ,
  likeClothingItem, dislikeClothingItem
};