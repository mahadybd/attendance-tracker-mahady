const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/is-auth');
const {
 getHomepage,
 getLogin,
 getRegister,
 getDashboard,
 postLogin,
 postRegister,
 postLogout,
 getEmailActivate,
 getForgotPassword,
 postForgotPassword,
 getResetPassword,
 postResetPassword
} = require('../controllers/appController');

router.route('/').get(getHomepage);
router.route('/login').get(getLogin).post(postLogin);
router.route('/dashboard').get(isAuth, getDashboard);
router.route('/register').get(getRegister).post(postRegister);
router.route('/logout').post(postLogout);
router.route('/email-activate').get(getEmailActivate);
router
 .route('/forgot-password')
 .get(getForgotPassword)
 .post(postForgotPassword);
router
 .route('/reset-password/:_id/:token')
 .get(getResetPassword)
 .post(postResetPassword);

module.exports = router;
