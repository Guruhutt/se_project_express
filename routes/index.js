const router = require('express').Router();
const clothesRouter = require('./clothes');
const { login, createUser ,getCurrentUser, updateUser} = require('../controllers/users');
const auth = require('../middleware/auth');

router.post('/signin', login);
router.post('/signup', createUser);

router.get('/users/me', auth, getCurrentUser);
router.patch('/users/me', auth, updateUser);


router.use('/items',auth, clothesRouter);

module.exports = router;