const express = require('express');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

const router = require('./routes/index');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const handleErrors = require('./utils/handleErrors');

const limiter = require('./utils/rateLimiter');

const { PORT = 3000, NODE_ENV, DB_URL } = process.env;

const options = {
  origin: [
    'http://localhost:3000',
    /* 'http://allmestos.nomoredomains.rocks',
    'https://allmestos.nomoredomains.rocks', */
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

const app = express();

app.use('*', cors(options));

app.use(cookieParser()); // подключаем парсер кук как мидлвэр

mongoose.connect(NODE_ENV === 'production' ? DB_URL : 'mongodb://localhost:27017/filmsdb', {
  useNewUrlParser: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());

app.use(limiter);

app.use(requestLogger); // подключаем логгер запросов

app.use('/', router); // подключаем роуты

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors()); // обработчик ошибок celebrate

app.use(handleErrors); // подключаем централизованный обработчик ошибок

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
