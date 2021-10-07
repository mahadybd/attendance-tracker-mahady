const express = require('express');
const session = require('express-session');
const mongoDBSession = require('connect-mongodb-session')(session);
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const connectDB = require('./config/db');

const TWO_HOURS = 1000 * 60 * 60 * 2;

// Load Config
dotenv.config({ path: './config/config.env' });

connectDB();

const mongoURL = 'mongodb://localhost:27017/sessions';

const store = new mongoDBSession({
 uri: mongoURL,
 collection: 'mySession'
});

const attendances = require('./routes/attendances');

const {
 PORT = process.env.PORT || 5000,
 NODE_ENV = 'development',

 SESS_NAME = 'sid',
 SESS_SECRET = "ssh!quiet,it'asecret",
 SESS_LIFETIME = TWO_HOURS
} = process.env;

const IN_PROD = NODE_ENV === 'production';

const app = express();

if (process.env.NODE_ENV === 'development') {
 app.use(morgan('dev'));
}

// Static Folder
//app.use(express.static('public'));
app.use(express.static('client'));

app.use(express.json()); //body purser , for add attendance in database

// Routes
app.use('/api/v1/attendances', attendances);
//app.use('/', require('./routes/index'));

app.use(
 session({
  name: SESS_NAME,
  resave: false,
  saveUninitialized: false,
  secret: SESS_SECRET,
  cookie: {
   maxAge: SESS_LIFETIME,
   sameSite: true,
   secure: IN_PROD,
   store: store
  }
 })
);

app.get('/', (req, res) => {
 req.session.isAuth = true;
 res.send('Hello world');
});

app.get('/login', () => {});

app.get('/register', () => {});

app.post('/login', () => {});

app.post('/register', () => {});

app.listen(
 PORT,
 console.log(
  `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
 )
);
