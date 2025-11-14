const Clothing = require("../models/clothing");
const BAD_REQUEST = require("../utils/bad_request");
const NOT_FOUND = require("../utils/not_found");
const INTERNAL_SERVER_ERROR = require("../utils/internal_error");
const FORBIDDEN = require("../utils/forbidden_error");

const getClothingItems = (req, res, next) => {
  Clothing.find({})
    .then((items) => res.send(items))
    .catch(() => {
      next(new INTERNAL_SERVER_ERROR("Internal Server Error"));
    });
};

const createClothingItem = (req, res, next) => {
  const { weather, imageUrl, name } = req.body;
  const owner = req.user._id; // Use the user ID from the request

  Clothing.create({ weather, imageUrl, owner, name })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BAD_REQUEST("Bad Request"));
      }
      console.error(err);
      return next(new INTERNAL_SERVER_ERROR("Internal Server Error"));
    });
};

const deleteClothingItem = (req, res, next) => {
  const { itemID } = req.params;
  const userID = req.user._id;
  Clothing.findById(itemID)
    .orFail()
    .then((item) => {
      if (item.owner.equals(userID) === false) {
        return next(
          new FORBIDDEN("You do not have permission to delete this item")
        );
      }
      return Clothing.findByIdAndDelete(itemID).then(() =>
        res.send({ message: "Item deleted successfully" })
      );
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return next(new BAD_REQUEST("Bad Request"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NOT_FOUND("Item not found"));
      }
      return next(new INTERNAL_SERVER_ERROR("Internal Server Error"));
    });
};

const likeClothingItem = (req, res, next) => {
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
      if (err.name === "ValidationError" || err.name === "CastError") {
        return next(new BAD_REQUEST("Bad Request"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NOT_FOUND("Item not found"));
      }
      return next(new INTERNAL_SERVER_ERROR("Internal Server Error"));
    });
};

const dislikeClothingItem = (req, res, next) => {
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
      if (err.name === "ValidationError" || err.name === "CastError") {
        return next(new BAD_REQUEST("Bad Request"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NOT_FOUND("Item not found"));
      }
      return next(new INTERNAL_SERVER_ERROR("Internal Server Error"));
    });
};

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  dislikeClothingItem,
};
