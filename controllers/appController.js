const bcrypt = require('bcrypt');
const User = require('../models/User');
const { InvalidIdException, UserNotFoundException } = require('./errors');

exports.getHomepage = (req, res) => {
 res.redirect('/login');
};

exports.getLogin = (req, res) => {
 const error = req.session.error;
 res.render('login');
};

exports.postLogin = async (req, res, next) => {
 const { email, password } = req.body;
 const user = await User.findOne({ email });

 if (!user) {
  next(new InvalidIdException());
  return res.redirect('/login');
 }

 const isMatch = await bcrypt.compare(password, user.password);

 if (!isMatch) {
  next(new UserNotFoundException());
  return res.redirect('/login');
 }

 req.session.isAuth = true;
 req.session.userName = user.name;
 req.session.userEmail = user.email;
 res.redirect('/dashboard');
};

exports.getRegister = (req, res) => {
 const error = req.session.error;
 delete req.session.error;
 res.render('register', { title: 'Attendance Tracker', err: error });
};

exports.postRegister = async (req, res) => {
 const { name, email, password } = req.body;

 let user = await User.findOne({ email });

 if (user) {
  req.session.error = 'User already exists';
  return res.redirect('/register');
 }

 const hasdPsw = await bcrypt.hash(password, 10);

 user = new User({
  name,
  email,
  password: hasdPsw
 });

 await user.save();
 res.redirect('/login');
};

exports.getDashboard = (req, res) => {
 userName = req.session.userName;
 userEmail = req.session.userEmail;
 res.render('main', {
  title: 'Tracker 1.0',
  userName: userName,
  userEmail: userEmail
 });
};

exports.postLogout = (req, res) => {
 req.session.destroy((err) => {
  if (err) throw err;
  res.clearCookie(process.env.SESS_NAME);
  res.redirect('/login');
 });
};
