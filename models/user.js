const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 30,
    select: false, // хеш пароля пользователя не будет возвращаться из базы
    validate: {
      validator: (v) => validator.isStrongPassword(v, [{ minLength: 8 }]),
      message: 'Пароль должен быть больше 8 символов',
    },
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password') // в случае аутентификации нужен пароль
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password) // юзер с переданной почтой найден.
      // хешируем пароль и сравниваем с тем хешем, который в базе
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }

          return user; // доступ к пользователю
        });
    });
};

module.exports = mongoose.model('user', userSchema);
