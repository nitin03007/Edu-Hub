var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs=require('hbs')
var loginRouter = require('./routes/login');
var dotenv =require('dotenv');

dotenv.config({ path: "./config.env" });


const {json}=require('express');

const bodyParser = require('body-parser');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');




require("./db/conn")

const Register =require("./models/register_model");

var app = express();

app.use(cors());
app.use(bodyParser.json());

const config=require("./config/config")
const session =require("express-session");

app.use(session({
  secret:config.sessionSecret.secret,
  resave: config.sessionSecret.resave,
  saveUninitialized: config.sessionSecret.saveUninitialized, 

}))




// view engine setup For Hbs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// view engine setup For EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'scripts')));
hbs.registerPartials(path.join(__dirname,'views/partials'));

app.use('/', loginRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
