const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
 dayNo: {
  type: String,
  trim: true,
  required: [true]
 },
 date: {
  type: String,
  required: [true]
 },
 hours: {
  type: String,
  required: [true]
 },
 month: {
  type: String,
  required: [true]
 },
 year: {
  type: Number,
  required: [true]
 },
 user: {
  type: String,
  required: [true]
 },
  email: {
  type: String,
  required: [true]
 },
 createdAt: {
  type: Date,
  default: Date.now
 }
});

module.exports = mongoose.model('Attendance', AttendanceSchema);
