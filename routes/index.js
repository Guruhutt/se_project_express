const router = require('express').Router();
const userRouter = require('./users');
const clothesRouter = require('./clothes');



router.use('/', userRouter);
router.use('/users/:userid', userRouter);
router.use('/users', userRouter);
router.use('/clothes', clothesRouter);
router.use('/clothes/items', clothesRouter);
router.use('/clothes/items/:itemID', clothesRouter);

module.exports = router;