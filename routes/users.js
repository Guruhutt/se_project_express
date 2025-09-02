const router = require('express').Router();
const auth = require('../middleware/auth');
const userRouter = require('./users');

router.use('/users', auth, userRouter);

module.exports = router;