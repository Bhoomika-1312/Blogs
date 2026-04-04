const { Router } = require("express");
const router = Router();
const userController = require('../controllers/userController');
const { requireAuth } = require('../middlewares/requireAuth');

router.get('/signin', userController.getSigninPage);
router.get('/signup', userController.getSignupPage);
router.get('/dashboard', userController.getDashboardPage);
router.get('/profile', userController.getProfilePage);
router.post('/profile', requireAuth, userController.updateProfile);
router.get('/profile/:id', userController.getPublicProfilePage);
router.post('/signin', userController.signin);
router.post('/signup', userController.signup);
router.get('/logout', userController.logout);

module.exports = router;