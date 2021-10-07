const Attendance = require('../models/Attendance');
const router = require('../routes/attendances');

//@desc Get All attendances
//@route GET /api/v1/attendances
//@access Public
exports.getAttendances = async (req, res, next) => {
 try {
  const attendances = await Attendance.find({ email: req.session.userEmail });

  return res.status(200).json({
   success: true,
   count: attendances.length,
   data: attendances
  });
 } catch (err) {
  return res.status(500).json({
   success: false,
   error: 'Server Error'
  });
 }
};

//@desc POST attendance
//@route POST /api/v1/attendances
//@access Public
exports.addAttendance = async (req, res, next) => {
 try {
  const { dayNo, date, hours, month, year, user } = req.body;

  const attendance = await Attendance.create(req.body);

  return res.status(201).json({
   success: true,
   data: attendance
  });
 } catch (err) {
  console.log(err);
 }
};

//@desc DELETE attendance
//@route DELETE /api/v1/attendances/:id
//@access Public
exports.deleteAttendance = async (req, res, next) => {
 //res.send('DELETE attendance');
 try {
  const attendance = await Attendance.findById(req.params.id);

  if (!attendance) {
   return res.status(404).json({
    success: false,
    error: 'No attendance found'
   });
  }

  await attendance.remove();

  return res.status(200).json({
   success: true,
   data: {}
  });
 } catch (err) {
  return res.status(500).json({
   success: false,
   error: 'Server Error'
  });
 }
};
