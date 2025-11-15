const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const UNAUTHORIZED = require("../utils/unauthorized");

const handleAuthError = (next) => {
  next(new UNAUTHORIZED("Authorization required"));
};

const extractBearerToken = (header) => header.replace("Bearer ", "");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return handleAuthError(next);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return handleAuthError(next);
  }

  req.user = payload;
  return next();
};
