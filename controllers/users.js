const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/badRequest');
const NotFoundError = require('../errors/notFound');
const ConflictError = require('../errors/conflict');
const UnauthorizedError = require('../errors/unauthorized');

const getCurrentUser = (req, res, next) => {
  const myId = req.user._id;

  return User.findById(myId)
    .orFail(() => {
      throw new NotFoundError('Пользователь с указанным _id не найден');
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => next(err));
};

const createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;

  bcrypt
    .hash(password, 10) // хеширование пароля
    .then((hash) => User.create({
      email, password: hash, name,
    }))
    .then((user) => {
      res.send({
        message: 'Пользователь создан!',
        email: user.email,
        name: user.name,
      });
    })
    .catch((err) => {
      if (err.name === 'MongoServerError' && err.code === 11000) {
        next(new ConflictError('Пользователь с указанным email уже существует'));
      } else {
        next(err);
      }
    });
};

const updateProfile = (req, res, next) => {
  const { email, name } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        res.send(user);
      }
      throw new NotFoundError('Пользователь с указанным _id не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const { NODE_ENV, JWT_SECRET } = process.env;
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      // отправим токен, браузер сохранит его в куках

      res
        .cookie('jwt', token, {
          // token - наш JWT токен, который мы отправляем
          maxAge: 3600000,
          httpOnly: true,
          sameSite: 'none',
          secure: true,
        })
        .send({ token }); // если у ответа нет тела, можно использовать метод end
    })
    .catch((err) => {
      next(new UnauthorizedError(`${err.message}`));
    });
};

const logout = (req, res) => {
  res.clearCookie('jwt', {
    secure: true,
    sameSite: 'none',
  }).send({ message: 'Выход осуществлен' });
};

module.exports = {
  getCurrentUser,
  createUser,
  updateProfile,
  login,
  logout,
};
