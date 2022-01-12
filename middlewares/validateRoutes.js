const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const validateUrl = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.message('Введена некорректная ссылка');
};

const validateUserUpdate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
});

const validateCreateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(validateUrl),
    trailer: Joi.string().required().custom(validateUrl),
    thumbnail: Joi.string().required().custom(validateUrl),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const validateDeleteMovie = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex(),
  }),
});

const validateRegistration = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().min(8).max(30).required(),
    name: Joi.string().required().min(2).max(30),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().min(8).max(30).required(),
  }),
});

module.exports = {
  validateUserUpdate,
  validateCreateMovie,
  validateDeleteMovie,
  validateRegistration,
  validateLogin,
};
