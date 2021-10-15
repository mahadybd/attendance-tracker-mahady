const express = require('express');
const app = express();
const session = require('express-session');

const jwt = require('jsonwebtoken');
//const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const mongoDBSession = require('connect-mongodb-session')(session);
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');

const connectDB = require('./config/db');
const attendances = require('./routes/attendances');

const appController = require('./controllers/appController');
const isAuth = require('./middleware/is-auth');

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
   maxAge: SESS_LIFETIME
  }
 })
);

// Landing Page Routes ----------
app.get('/', appController.getHomepage);

// Login Page
app.get('/login', appController.getLogin);
app.post('/login', appController.postLogin);

// Register Page
app.get('/register', appController.getRegister);
app.post('/register', appController.postRegister);

// Dashboard Page
app.get('/dashboard', isAuth, appController.getDashboard);

//Logout page
app.post('/logout', appController.postLogout);

// API Routes
app.use('/api/v1/attendances', attendances);

app.listen(
 PORT,
 console.log(
  `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
 )
);
