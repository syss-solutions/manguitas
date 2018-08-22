var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// 20180822 - Mongoose
var mongoose   = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// 20180822 - API Router
var apiRouter = require('./routes/api');

var app = express();
// 20180822 - Configure app to use bodyParser(). This will let us get the data from a POST.
var bodyParser = require('body-parser');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 20180822 - Configure app to use bodyParser(). This will let us get the data from a POST.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 20180822 - Connect to our Database
mongoose.connect('mongodb://127.0.0.1:27017/com-syss-db-manguitas');

app.use('/', indexRouter);
app.use('/users', usersRouter);
// 20180822 - REGISTER OUR ROUTES. All of our routes will be prefixed with /api
app.use('/api', apiRouter);

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
