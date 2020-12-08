var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors =require('cors');
var app = express();





var productsRouter= require('./routes/products');
var usersRoute = require('./routes/users');
var ordersRoute = require('./routes/orders');
//var newOrderRoute = require('./routes/new');

app.use('/api/products', productsRouter);
app.use('/api/users', usersRoute);
app.use('/api/orders', ordersRoute);
//app.use('/api/new', newOrderRoute);

app.use(cors( {
  origin : "*",
  methods : ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
  allowedHeaders : 'Content-Type, Authorization, Origins, X-Requested-With, Accept'

}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



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
