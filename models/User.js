const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
 name: {
  type: String,
  required: true
 },
 email: {
  type: String,
  required: true,
  lowercase: true,
  unique: true
 },
 password: {
  type: String,
  required: true
 },
 createdAt: {
  type: Date,
  default: Date.now
 }
});

//module.exports = mongoose.model('User', userSchema);
const User = mongoose.model('User', userSchema);
module.exports = User;
