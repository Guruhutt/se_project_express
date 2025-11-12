const Clothing = require("../models/clothing");
const { BAD_REQUEST } = require("../utils/bad_request");
const { NOT_FOUND } = require("../utils/not_found");
const { INTERNAL_SERVER_ERROR } = require("../utils/internal_error");
const { FORBIDDEN } = require("../utils/forbidden_error");

const getClothingItems = (req, res, next) => {
  Clothing.find({})
    .then((items) => res.send(items))
    .catch(() => {
      next(new INTERNAL_SERVER_ERROR("Internal Server Error"));
    });
};

const createClothingItem = (req, res) => {
  const { weather, imageUrl, name } = req.body;
  const owner = req.user._id; // Use the user ID from the request

  Clothing.create({ weather, imageUrl, owner, name })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Bad Request" });
      }
      console.error(err);
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Internal Server Error" });
    });
};

const deleteClothingItem = (req, res) => {
  const { itemID } = req.params;
  const userID = req.user._id;
  Clothing.findById(itemID)
    .orFail()
    .then((item) => {
      if (item.owner.equals(userID) === false) {
        return res
          .status(FORBIDDEN)
          .send({ message: "Forbidden: You can only delete your own items" });
      }
      return Clothing.findByIdAndDelete(itemID).then(() =>
        res.send({ message: "Item deleted successfully" })
      );
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Bad Request" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Internal Server Error" });
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
      if (err.name === "ValidationError" || err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Bad Request" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Internal Server Error" });
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
      if (err.name === "ValidationError" || err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Bad Request" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Internal Server Error" });
    });
};

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  dislikeClothingItem,
};
