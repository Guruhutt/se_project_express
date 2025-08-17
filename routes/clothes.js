const router = require('express').Router();
const {getClothingItems, createClothingItem, deleteClothingItem, likeClothingItem, dislikeClothingItem } = require('../controllers/clothing');

router.get("/", getClothingItems);
router.post("/", createClothingItem);
router.delete("/:itemID", deleteClothingItem);
router.put("/items/:itemID/like", likeClothingItem);
router.put("/:itemID/dislike", dislikeClothingItem);

module.exports = router;