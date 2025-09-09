const router = require('express').Router();
const {getClothingItems, createClothingItem, deleteClothingItem, likeClothingItem, dislikeClothingItem } = require('../controllers/clothing');
const auth = require('../middleware/auth');

router.get("/", getClothingItems);

router.use(auth);

router.post("/", createClothingItem);
router.delete("/:itemID", deleteClothingItem);
router.put("/:itemID/likes", likeClothingItem);
router.delete("/:itemID/likes", dislikeClothingItem);

module.exports = router;