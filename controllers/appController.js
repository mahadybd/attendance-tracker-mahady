const bcrypt = require('bcrypt');
const { request } = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { InvalidIdException, UserNotFoundException } = require('./errors');

dotenv.config({ path: '../config/config.env' });

const mailgun = require('mailgun-js');
const DOMAIN = 'sandbox7f5eb5ecb9a74ad893e173d6aae3cc6e.mailgun.org';
const MAILGUN_APIKEY = 'b8fdd7c5c2f69c8870a138bc21d30e4a-7dcc6512-f5573585';
const mg = mailgun({ apiKey: MAILGUN_APIKEY, domain: DOMAIN });

const jwt_decode = require('jwt-decode');

exports.getHomepage = (req, res) => {
 res.redirect('/login');
};

exports.getLogin = (req, res) => {
 const errMessage = req.session.error;
 res.render('login', { errMessage });
 delete req.session.error;
};

exports.postLogin = async (req, res) => {
 const { email, password } = req.body;
 const user = await User.findOne({ email });

 if (!user) {
  req.session.error = 'Invalid user ID';
  return res.redirect('/login');
 }

 const isMatch = await bcrypt.compare(password, user.password);

 if (!isMatch) {
  req.session.error = 'Wrong password!';
  return res.redirect('/login');
 }

 req.session.isAuth = true;
 req.session.userName = user.name;
 req.session.userEmail = user.email;
 res.redirect('/dashboard');
};

exports.getRegister = (req, res) => {
 const errMessage = req.session.error;
 res.render('register', { title: 'Attendance Tracker', errMessage });
 delete req.session.error;
};

exports.postRegister = async (req, res, next) => {
 try {
  const { name, email, password } = req.body;

  let user = await User.findOne({ email });

  if (user) {
   req.session.error = req.body.email + ' ' + 'user already exists';
   return res.redirect('/register');
  }

  const hasdPsw = await bcrypt.hash(password, 10);

  user = new User({
   name,
   email,
   password: hasdPsw
  });

  await user.save();
  res.redirect('/email-activate');
 } catch (error) {
  next(error);
 }
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

exports.getEmailActivate = (req, res) => {
 res.render('email_activate', { title: 'Attendance Tracker' });
};

exports.getForgotPassword = (req, res) => {
 const errMessage = req.session.error;
 res.render('forgot-password', {
  title: 'Enter your email address',
  errMessage
 });
 delete req.session.error;
};

exports.postForgotPassword = async (req, res, next) => {
 try {
  let { email } = req.body;
  let user = await User.findOne({ email });

  if (!user) {
   req.session.error = `No user register with this email ${email}`;
   return res.redirect('/forgot-password');
  }

  // Create one time valid link
  const JWT_SECRET = process.env.JWT_SECRET;
  const secret = JWT_SECRET + user.password;
  const payload = {
   email: user.email,
   id: user._id
  };
  const token = jwt.sign(payload, secret, { expiresIn: '10m' });
  const link = `${process.env.HOST_URL}/reset-password/${user._id}/${token}`;
  console.log(link);

  //send link to the email
  const data = {
   from: 'no-reply@mahadyhasan.com',
   to: email,
   subject: 'Reset password link',
   html: `
        <h2>Please click on the following link</h2>
        <p>${link}</p>
      `
  };
  mg.messages().send(data, function (error, body) {
   console.log(body);
  });

  res.send(`Password reset link has been send to ${email}`);
 } catch (error) {
  next(error);
 }
};

exports.getResetPassword = async (req, res, next) => {
 const { _id, token } = req.params;
 console.log(_id);
 let user = await User.findOne({ _id });
 // if this id exist in database
 //  if (_id !== user._id) {
 //   res.send('Invalid ID');
 //   return;
 //  }
 // we have valid ID and we have valid user with this ID
 const JWT_SECRET = process.env.JWT_SECRET;
 const secret = JWT_SECRET + user.password;
 try {
  const payload = jwt.verify(token, secret);
  res.render('reset-password', { title: 'Enter your new Password' });
 } catch (error) {
  next(error);
 }
};

exports.postResetPassword = async (req, res, next) => {
 const { _id, token } = req.params;
 let user = await User.findOne({ _id });
 const { password, password2 } = req.body;
 // if this id exist in database
 //  if (_id !== user._id) {
 //   res.send('Invalid id');
 //   return;
 //  }

 const JWT_SECRET = process.env.JWT_SECRET;
 const secret = JWT_SECRET + user.password;
 try {
  const payload = jwt.verify(token, secret);
  //validate password and password2 should match

  //hash the password before save
  const hasdPsw = await bcrypt.hash(password, 10);

  user.password = hasdPsw;
  await user.save();
  res.send(`Password has been updated`);
 } catch (error) {
  next(error);
 }
};
