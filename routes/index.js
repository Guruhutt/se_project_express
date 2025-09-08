const router = require('express').Router();
const clothesRouter = require('./clothes');
const { login, createUser } = require('../controllers/users');
const auth = require('../middleware/auth');
const userRouter = require('./users');



router.post('/signin', login);
router.post('/signup', createUser);


router.use('/users', auth, userRouter);


router.use('/items', clothesRouter);

module.exports = router;