const router = require('express').Router();
const clothesRouter = require('./clothes');
const userRouter = require('./users');

router.use('/users', userRouter);
router.use('/items', clothesRouter);

module.exports = router;