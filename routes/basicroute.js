const express = require('express');
const router = express.Router();
const { userLogin } = require('../controllers/basicroutecontroll');

router.route('/').post(userLogin);

module.exports = router;
