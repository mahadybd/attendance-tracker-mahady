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
 postLogout
} = require('../controllers/appController');

router.route('/').get(getHomepage);
router.route('/login').get(getLogin).post(postLogin);
router.route('/dashboard').get(isAuth, getDashboard);
router.route('/register').get(getRegister).post(postRegister);
router.route('/logout').post(postLogout);

module.exports = router;
