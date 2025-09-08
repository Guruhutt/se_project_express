const router = require('express').Router();
const {getCurrentUser, updateUser} = require('../controllers/users');

router.use('/users', auth, userRouter);
router.get('/me', auth, getCurrentUser);
router.patch('/me', auth, updateUser);

module.exports = router;