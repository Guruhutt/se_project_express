const router = require('express').Router();

router.get("/users", (req, res) => {
  res.status(200).json({
    message: "Welcome to the API",
    status: "success"
  });
});

module.exports = router;