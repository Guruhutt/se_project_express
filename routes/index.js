const router = require("express").Router();
const {
  validateUserSignin,
  validateUserSignup,
} = require("../middleware/validation");
const clothesRouter = require("./clothes");
const { login, createUser } = require("../controllers/users");
const auth = require("../middleware/auth");
const userRouter = require("./users");

router.post("/signin", validateUserSignin, login);
router.post("/signup", validateUserSignup, createUser);

router.use("/users", auth, userRouter);

router.use("/items", clothesRouter);

module.exports = router;
