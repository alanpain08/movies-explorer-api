const router = require('express').Router();
const { validateCreateMovie, validateDeleteMovie } = require('../middlewares/validateRoutes');
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', validateCreateMovie, createMovie);
router.delete('/:movieId', validateDeleteMovie, deleteMovie);

module.exports = router;
