const router = require('express').Router();
const {getClothingItems, createClothingItem, deleteClothingItem} = require('../controllers/clothes');

router.get("/", getClothingItems);
router.post("/items", createClothingItem);
router.delete("/items/:itemID", deleteClothingItem);

module.exports = router;