var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// 20180822 - Mongoose
var mongoose   = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// 20180822 - Book API Router
var bookApiRouter = require('./routes/book_api');
// 20180828 - Collection API Router
var collectionApiRouter = require('./routes/collection_api');

var app = express();
// 20180822 - Configure app to use bodyParser(). This will let us get the data from a POST.
var bodyParser = require('body-parser');

// 20180824 - In order to handle PUT and DELETE request, you must use method-override module.
var methodOverride = require('method-override');
// Override with the X-HTTP-Method-Override header in the request.
app.use(methodOverride('X-HTTP-Method-Override'))

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
mongoose.connect('mongodb://127.0.0.1:27017/com-syss-db-manguitas', { useNewUrlParser: true });

app.use('/', indexRouter);
app.use('/users', usersRouter);
// 20180822 - REGISTER OUR ROUTES. All of our routes will be prefixed with /api
// 20180822 - BOOK API ROUTES.
app.use('/api', bookApiRouter);
// 20180828 - COLLECTION API ROUTES.
app.use('/api', collectionApiRouter);

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
