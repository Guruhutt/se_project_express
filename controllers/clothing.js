const { get } = require('mongoose');
const Clothing = require('../models/clothing');
const { BAD_REQUEST,NOT_FOUND,INTERNAL_SERVER_ERROR } = require("../utils/errors");


const getClothingItems = (req, res) => {
  Clothing.find({}).orFail()
    .then(items => res.send(items))
    .catch((err) => {
      console.error(err);
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Internal Server Error' });
    });
};

const createClothingItem = (req, res) => {
  const { name, size, color } = req.body;
  const clothingItem = new Clothing({ name, size, color });

  Clothing.create({ name, size, color })
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

module.exports = {
  getClothingItems,createClothingItem,deleteClothingItem
};