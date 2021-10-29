const express = require('express');
const router = express.Router();
const {
 getAttendances,
 addAttendance,
 deleteAttendance
} = require('../controllers/attendances');
const {} = require('../controllers/appController');

//router.get('/', (req, res) => res.send('Hello'));

router.route('/').get(getAttendances).post(addAttendance);

router.route('/:id').delete(deleteAttendance);

module.exports = router;
