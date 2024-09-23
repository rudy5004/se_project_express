const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

// Helper function to validate URLs using validator.isURL
const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

// 1. Validator for creating a clothing item
module.exports.validateClothingItemBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'The "imageUrl" field must be a valid url',
    }),
    weather: Joi.string().required().messages({
      "string.empty": 'The "weather" field must be filled in',
    }),
  }),
});

// 2. Validator for user creation
module.exports.validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatar" field must be filled in',
      "string.uri": 'The "avatar" field must be a valid url',
    }),
    email: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (!validator.isEmail(value)) {
          return helpers.message('The "email" field must be a valid email');
        }
        return value;
      })
      .messages({
        "string.empty": 'The "email" field must be filled in',
      }),
    password: Joi.string().required().min(8).messages({
      "string.min": 'The minimum length of the "password" field is 8',
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

// 3. Validator for user login
module.exports.validateLoginBody = celebrate({
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (!validator.isEmail(value)) {
          return helpers.message('The "email" field must be a valid email');
        }
        return value;
      })
      .messages({
        "string.empty": 'The "email" field must be filled in',
      }),
    password: Joi.string().required().min(8).messages({
      "string.min": 'The minimum length of the "password" field is 8',
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

// 4. Validator for validating IDs from URL parameters (24-character hexadecimal)
module.exports.validateId = celebrate({
  params: Joi.object().keys({
    id: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (!validator.isHexadecimal(value) || value.length !== 24) {
          return helpers.message(
            'The "id" must be a valid 24-character hexadecimal string'
          );
        }
        return value;
      })
      .messages({
        "string.empty": 'The "id" field must be filled in',
      }),
  }),
});
