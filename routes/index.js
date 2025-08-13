const router = require('express').Router();

const userRouter = require('./users');

router.use('/users', userRouter);
router.use('/users/:id', userRouter);

module.exports = router;