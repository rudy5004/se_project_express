const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

// Reusable URL validation function
const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

// Clothing item validation
const validateClothingItem = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'The "imageUrl" field must be a valid URL',
    }),
  }),
});

// User info validation
const validateUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatar" field must be filled in',
      "string.uri": 'The "avatar" field must be a valid URL',
    }),
    email: Joi.string().required().email().messages({
      "string.email": 'The "email" field must be a valid email address',
      "string.empty": 'The "email" field must be filled in',
    }),
    password: Joi.string().required().min(8).messages({
      "string.min": 'The minimum length of the "password" field is 8',
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

// Login validation
const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.email": 'The "email" field must be a valid email address',
      "string.empty": 'The "email" field must be filled in',
    }),
    password: Joi.string().required().min(8).messages({
      "string.min": 'The minimum length of the "password" field is 8',
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

// Hex ID validation
const validateHexId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required().messages({
      "string.hex": 'The "id" field must be a valid hex string',
      "string.length": 'The "id" field must be exactly 24 characters long',
      "string.empty": 'The "id" field must be filled in',
    }),
  }),
});

// Query parameter validation
const validateQueryParams = celebrate({
  query: Joi.object().keys({
    userId: Joi.string().hex().length(24).required().messages({
      "string.hex": 'The "userId" query parameter must be a valid hex string',
      "string.length":
        'The "userId" query parameter must be exactly 24 characters long',
      "string.empty": 'The "userId" query parameter must be provided',
    }),
  }),
});

// Header validation
const validateHeaders = celebrate({
  headers: Joi.object({
    authorization: Joi.string().required().messages({
      "any.required": "Authorization header is required",
      "string.empty": "Authorization header must not be empty",
    }),
  }).unknown(), // Allow other headers to be present, but only validate `authorization`
});

module.exports = {
  validateClothingItem,
  validateUserInfo,
  validateLogin,
  validateHexId,
  validateQueryParams,
  validateHeaders,
};
