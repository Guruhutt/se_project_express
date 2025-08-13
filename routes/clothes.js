const router = require('express').Router();
const {getclothingItems, createClothingItem, deleteClothingItem} = require('../controllers/clothes');

router.get("/", getclothingItems);
router.post("/items", createClothingItem);
router.delete("/items/:itemID", deleteClothingItem);