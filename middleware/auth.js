const { JWT_SECRET } = require('./config');
const jwt = require("jsonwebtoken");
const { UNAUTHORIZED } = require("../utils/errors");

const handleAuthError = (res) => {
  res.status(UNAUTHORIZED).send({ message: "Authorization Error" });
};

const extractBearerToken = (header) => header.replace("Bearer ", "");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return handleAuthError(res);
  }

  const token = extractBearerToken(authorization);
  let payload;

  const { JWT_SECRET = "dev-secret" } = process.env;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;
  return next();
};
