const { Joi, celebrate } = require("celebrate");
const validator = require("validator");
const user = require("../models/user");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const validateClothingItem = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({}),
    imageUrl: Joi.string().required().custom(validateURL),
    weather: Joi.string().valid("hot", "warm", "cold").required(),
  }),
});

const validateItemId = celebrate({
  params: Joi.object().keys({
    itemID: Joi.string().alphanum().length(24).required().messages({
      "string.length": 'The "itemID" parameter must be 24 characters long',
    }),
  }),
});

const validateUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatar" field must be filled in',
      "string.uri": 'the "avatar" field must be a valid url',
    }),
  }),
});

module.exports = {
  validateClothingItem,
  validateItemId,
  validateUserUpdate,
};
