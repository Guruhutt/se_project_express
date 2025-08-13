const router = require('express').Router();
const { getUsers,createUser } = require('../controllers/users');

router.get("/", getUsers);

router.get("/users/:id", ()=> console.log("GET user by ID"));

router.post("/", createUser);

module.exports = router;