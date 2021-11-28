const router = require('express').Router();
const { validateUserUpdate } = require('../middlewares/validateRoutes');
const {
  getCurrentUser,
  updateProfile,
} = require('../controllers/users');

router.get('/me', getCurrentUser);
router.patch('/me', validateUserUpdate, updateProfile);

module.exports = router;
