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
  }),
});

const validateUserProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({}),
    imageUrl: Joi.string().required().custom(validateURL).messages({}),
    email: Joi.string().required().email().messages({}),
    password: Joi.string().required().messages({}),
  }),
});

const validateUserLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({}),
    password: Joi.string().required().messages({}),
  }),
});

const validateId = celebrate({
  params: Joi.object().keys({
    itemsID: Joi.string().alphanum().length(24).required().messages({
      "string.length": 'The "id" parameter must be 24 characters long',
    }),
    userID: Joi.string().alphanum().length(24).required().messages({
      "string.length": 'The "id" parameter must be 24 characters long',
    }),
  }),
});

const validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),

    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),
  }),
});

module.exports = {
  validateClothingItem,
  validateUserProfile,
  validateUserLogin,
  validateId,
  validateCardBody,
};
