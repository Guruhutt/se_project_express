const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const auth = require("../middleware/auth");

const { getCurrentUser, updateUser } = require("../controllers/users");

router.get("/me", auth, getCurrentUser);

router.patch(
  "/me",
  auth,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      avatar: Joi.string().required().uri(),
    }),
  }),
  updateUser
);

module.exports = router;
