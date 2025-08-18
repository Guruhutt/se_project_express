const router = require('express').Router();
const {getClothingItems, createClothingItem, deleteClothingItem, likeClothingItem, dislikeClothingItem } = require('../controllers/clothing');

router.get("/", getClothingItems);
router.post("/", createClothingItem);
router.delete("/:itemID", deleteClothingItem);
router.put("/:itemID/like", likeClothingItem);
router.delete("/:itemID/like", dislikeClothingItem);

module.exports = router;