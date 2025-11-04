const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
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

router.post(
  "/",
  auth,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      imageUrl: Joi.string().required().uri(),
      weather: Joi.string().valid("hot", "warm", "cold").required(),
    }),
  }),
  createClothingItem
);

router.delete(
  "/:itemID",
  auth,
  celebrate({
    params: Joi.object().keys({
      itemID: Joi.string().alphanum().length(24),
    }),
    query: Joi.object().keys({}),
  }),
  deleteClothingItem
);

router.put(
  "/:itemID/likes",
  auth,
  celebrate({
    params: Joi.object().keys({
      itemId: Joi.string().alphanum().length(24),
    }),
    query: Joi.object().keys({}),
  }),
  likeClothingItem
);

router.delete(
  "/:itemID/likes",
  auth,
  celebrate({
    params: Joi.object().keys({
      itemId: Joi.string().alphanum().length(24),
    }),
    query: Joi.object().keys({}),
  }),
  dislikeClothingItem
);

module.exports = router;
