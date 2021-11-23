const express = require('express');
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const exphbs = require('express-handlebars');
const mongoDBSession = require('connect-mongodb-session')(session);
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const error = require('./middleware/error');

const connectDB = require('./config/db');
const attendances = require('./routes/attendances');
const basicroutes = require('./routes/basicroutes');

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

const TWO_HOURS = 1000 * 60 * 60 * 9;
const SESS_LIFETIME = TWO_HOURS;

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'development') {
 app.use(morgan('dev'));
}

const store = new mongoDBSession({
 uri: process.env.MONGO_URI,
 collection: 'mySession'
});

//Session middleware
app.use(
 session({
  name: process.env.SESS_NAME,
  secret: process.env.SESS_SECRET,
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: {
   httpOnly: true, // no one can access cookie. added this line 18.10.21
   maxAge: SESS_LIFETIME
  }
 })
);

app.use(flash());

// Basic Page Routes ----------
app.use(basicroutes, express.static(__dirname + '/public'));

// API Routes
app.use('/api/v1/attendances', attendances);

// 404 handler and pass error handler
app.use((req, res, next) => {
 const err = new Error('page Not found!');
 err.status = 404;
 next(err);
});

//Error > middleware/error.js
app.use(error);

app.listen(
 PORT,
 console.log(
  `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
 )
);
