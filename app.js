var createError = require('http-errors');
var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// 20180822 - Mongoose
var mongoose   = require('mongoose');
// 20180906 - Adding configuration file
var config = require('./config/config')

// 20180829 - index.js access deleted.
// var indexRouter = require('./routes/index');
// 20180906 - Adding JWT authorization...
var authorization = require('./config/auth/authorization');
// 20180829 - Updating users.js into Users WS API.
var usersRouter = require('./routes/users_api');
// 20180822 - Book API Router
var bookApiRouter = require('./routes/book_api');
// 20180828 - Collection API Router
var collectionApiRouter = require('./routes/collection_api');

var app = express();
// 20180822 - Configure app to use bodyParser(). This will let us get the data from a POST.
var bodyParser = require('body-parser');
// 20180906 - For each request, provide wildcard Access-Control-* headers via OPTIONS call
app.use(cors());

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
// mongoose.connect('mongodb://127.0.0.1:27017/com-syss-db-manguitas', { useNewUrlParser: true });
// 20180829 - kurtces (becaskurtces@gmail.com) MLab (https://mlab.com/) MongoDB Connection
// mongoose.connect('mongodb://kurtces:Dl21grmT@ds022228.mlab.com:22228/com-syss-db-manguitas', { useNewUrlParser: true });
mongoose.connect(config.DATABASE, { useNewUrlParser: true })
        // 20180906 - Adding logs...
        .then(() => {
            console.info('Succesfully Connected to the Mongodb Database..')
        })
        .catch(() => {
            console.error('Error Connecting to the Mongodb Database...')
        });

// 20180829 - index.js access deleted.
// app.use('/', indexRouter);
// 20180906 - Adding JWT authorization...
app.use('/api/auth', authorization);
// 20180829 - Updating users.js into Users WS API.
app.use('/api', usersRouter);
// 20180822 - REGISTER OUR ROUTES. All of our routes will be prefixed with /api
// 20180822 - BOOK API ROUTES.
app.use('/api', bookApiRouter);
// 20180828 - COLLECTION API ROUTES.
app.use('/api', collectionApiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  // 20180906 - Adding logs...
  console.error('404 - Not found');
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === config.ENVIRONMENT ? err : {};

  // 20180906 - Adding logs...
  console.log('Error: %d', err.message);

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
