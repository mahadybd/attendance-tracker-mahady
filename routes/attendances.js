const express = require('express');
const router = express.Router();
const {getAttendances, addAttendance, deleteAttendance} = require('../controllers/attendances');

//router.get('/', (req, res) => res.send('Hello'));

router
  .route('/')
  .get(getAttendances)
  .post(addAttendance);

router.route('/:id')
  .delete(deleteAttendance);

router.get('/', (req, res)=> {
  res.send('Login Area')
})

module.exports = router;