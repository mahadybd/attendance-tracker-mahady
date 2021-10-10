const express = require('express');
const app = express();
const session = require('express-session');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const mongoDBSession = require('connect-mongodb-session')(session);
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');

const UserModel = require('./models/User');
const connectDB = require('./config/db');
const attendances = require('./routes/attendances');

// Load Config
dotenv.config({ path: './config/config.env' });

connectDB();

// Static Folder
app.use(express.static('public'));
//app.use(express.static('client'));

//body Parser , for add attendance in database
app.use(express.json());

//Handlebars setting
app.engine(
 'hbs',
 exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  defaultLayout: 'index',
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials'
 })
);

app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: true }));

const TWO_HOURS = 1000 * 60 * 60 * 2;

const {
 PORT = process.env.PORT || 5000,
 NODE_ENV = 'development',

 SESS_LIFETIME = TWO_HOURS
} = process.env;

const IN_PROD = NODE_ENV === 'production';

if (process.env.NODE_ENV === 'development') {
 app.use(morgan('dev'));
}

//app.use('/login', basicroute);
//app.use('/', require('./routes/index'));

const store = new mongoDBSession({
 uri: process.env.MONGO_URI,
 collection: 'mySession'
});
let userName = null;
let userEmail = null;

//Session middleware
app.use(
 session({
  name: process.env.SESS_NAME,
  secret: process.env.SESS_SECRET,
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: {
   maxAge: SESS_LIFETIME,
   sameSite: true,
   secure: IN_PROD
  }
 })
);

//RedirectLogin middleware
const isAuth = (req, res, next) => {
 if (req.session.isAuth) {
  next();
 } else {
  res.redirect('/');
 }
};

const islogedin = (req, res, next) => {
 if (req.session.isAuth) {
  res.redirect('/dashboard');
 } else {
  //res.redirect('/');
  next();
 }
};

//landing Page
app.get('/', islogedin, (req, res) => {
 res.render('login', { title: 'Attendance Tracker' });
});

app.get('/register', islogedin, (req, res) => {
 res.render('register', { title: 'Attendance Tracker' });
});

app.get('/logout', islogedin, (req, res) => {
 res.render('login', { title: 'Attendance Tracker' });
});

app.get('/dashboard', isAuth, (req, res) => {
 userName = req.session.userName;
 userEmail = req.session.userEmail;
 res.render('main', {
  title: 'Attendance Tracker',
  userName: userName,
  userEmail: userEmail
 });
});

//-----------
app.post('/', async (req, res) => {
 const { email, password } = req.body;
 const user = await UserModel.findOne({ email }).lean();
 console.log(user.email);

 sess = req.session;
 sess.userEmail = req.body.email;

 if (!user) {
  console.log('Invalid username');
  return res.redirect('/');
 }

 const isMatch = await bcrypt.compare(password, user.password);

 if (!isMatch) {
  console.log('Invalid password');
  return res.redirect('/');
 }

 if (user) {
  req.session.userName = user.name;
  req.session.userEmail = user.email;
  req.session.isAuth = true;
  res.redirect('/dashboard');
 }
});
//-------Login End-------

app.post('/register', async (req, res) => {
 const { name, email, password } = req.body;

 let user = await UserModel.findOne({ email });

 if (user) {
  console.log('given email already have an account');
  return res.redirect('/register');
 }

 const hashedPassword = await bcrypt.hash(req.body.password, 10);
 user = new UserModel({
  name,
  email,
  password: hashedPassword
 });

 await user.save();

 res.redirect('/');
});

app.post('/logout', (req, res) => {
 req.session.isAuth = false;
 req.session.destroy((err) => {
  if (err) throw err;
  res.clearCookie(process.env.SESS_NAME);
  res.redirect('/logout');
 });
});

app.listen(
 PORT,
 console.log(
  `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
 )
);

// Routes
app.use('/api/v1/attendances', attendances);
