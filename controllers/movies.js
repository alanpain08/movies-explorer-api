const Movie = require('../models/movie');
const BadRequestError = require('../errors/badRequest');
const NotFoundError = require('../errors/notFound');
const ForbiddenError = require('../errors/forbidden');

const getMovies = (req, res, next) => {
  const ownerId = req.user._id;

  Movie.find({ owner: ownerId })
    .then((movies) => res.send(movies))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  return Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    owner: req.user._id,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании фильма'));
      }
      next(err);
    });
};

const deleteMovie = (req, res, next) => {
  const userId = req.user._id;

  return Movie.findById(req.params.movieId)
    .orFail(() => new NotFoundError('Нет фильма по данному id'))
    .then((movie) => {
      if (!movie.owner.toString().equals(userId)) {
        next(new ForbiddenError('Нельзя удалять чужие фильмы!'));
      }
      return Movie.remove({ _id: req.params.movieId })
        .then(() => {
          res.send({ message: 'Фильм удален' });
        });
    })
    .catch(next);
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
