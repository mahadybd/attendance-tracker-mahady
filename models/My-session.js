const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
 userName: {
  type: String,
  required: true
 },
 userEmail: {
  type: String,
  required: true
 },
 isAuth: {
  type: String,
  required: true
 }
});

module.exports = mongoose.model('My-session', sessionSchema);
