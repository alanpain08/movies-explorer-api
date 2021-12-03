const router = require('express').Router();
const {
  createUser,
  login,
  logout,
} = require('../controllers/users');
const auth = require('../middlewares/auth');
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const NotFoundError = require('../errors/notFound');
const { validateRegistration, validateLogin } = require('../middlewares/validateRoutes');

router.post('/signup', validateRegistration, createUser);
router.post('/signin', validateLogin, login);
router.post('/signout', logout);

router.use(auth);

router.use('/users', usersRouter);
router.use('/movies', moviesRouter);
router.use('*', (req, res, next) => {
  next(new NotFoundError('Ресурс не найден'));
});

module.exports = router;
