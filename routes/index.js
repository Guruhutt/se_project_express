const router = require('express').Router();
const clothesRouter = require('./clothes');
const userRouter = require('./users');
const { login, createUser } = require('../controllers/users');

app.get('/signin', login);
app.get('/signup', createUser);
app.patch('/users/me', updateUser);
router.use('/users', userRouter);
router.use('/items', clothesRouter);

module.exports = router;