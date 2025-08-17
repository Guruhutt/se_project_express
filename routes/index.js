const router = require('express').Router();
const clothesRouter = require('./clothes');



router.use('/items', clothesRouter);

module.exports = router;