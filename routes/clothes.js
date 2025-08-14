const router = require('express').Router();
const {getClothingItems, createClothingItem, deleteClothingItem, likeClothingItem, dislikeClothingItem } = require('../controllers/clothes.js');

router.get("/", getClothingItems);
router.post("/items", createClothingItem);
router.delete("/items/:itemID", deleteClothingItem);
router.put("/items/:itemID/like", likeClothingItem);
router.put("/items/:itemID/dislike", dislikeClothingItem);

module.exports = router;