const router = require("express").Router();
const {
  validateClothingItem,
  validateItemId,
} = require("../middleware/validation");

const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  dislikeClothingItem,
} = require("../controllers/clothing");
const auth = require("../middleware/auth");

router.get("/", getClothingItems);

router.use(auth);

router.post("/", auth, validateClothingItem, createClothingItem);

router.delete("/:itemID", auth, validateItemId, deleteClothingItem);

router.put("/:itemID/likes", auth, validateItemId, likeClothingItem);

router.delete("/:itemID/likes", auth, validateItemId, dislikeClothingItem);

module.exports = router;
