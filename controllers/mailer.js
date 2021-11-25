const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config({ path: '../config/config.env' });

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
 host: 'smtp.ethereal.email',
 port: 587,
 secure: false, // true for 465, false for other ports
 auth: {
  user: process.env.MAILGUN_USER, // generated ethereal user
  pass: testAccount.MAILGUN_PASS // generated ethereal password
 }
});
