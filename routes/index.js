const router = require("express").Router();
const clothesRouter = require("./clothes");
const { login, createUser } = require("../controllers/users");
const { celebrate, Joi } = require("celebrate");
const auth = require("../middleware/auth");
const userRouter = require("./users");

router.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login
);
router.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      name: Joi.string().required().min(2).max(30),
      avatar: Joi.string().required().uri(),
    }),
  }),
  createUser
);

router.use("/users", auth, userRouter);

router.use("/items", clothesRouter);

module.exports = router;
