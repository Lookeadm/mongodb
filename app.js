var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const mongoose = require('mongoose');
require("./models/userModel");
require("./models/productModel");
require("./models/studentModel");
require("./models/categoryModel");
//http://localhost:3000
var indexRouter = require('./routes/index');
//http://localhost:3000/users
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
var studentRouter = require('./routes/students');
var categoryRouter = require('./routes/categories');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//connect database
mongoose.connect('mongodb+srv://namnnps38713:wcVNA8PAeuqTioxq@namnnps38713.bctmi.mongodb.net/md19301')
  .then(() => console.log('>>>>>>>>>> DB Connected!!!!!!'))
  .catch(err => console.log('>>>>>>>>> DB Error: ', err));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/students', studentRouter);
app.use('/categories', categoryRouter);
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
