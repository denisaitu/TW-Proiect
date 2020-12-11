var createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors =require('cors');
const app = express();

const bodyParser = require('body-parser');   
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

/*
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: "Shop API",
            description: "Backend Api",
            contact: {
                name: 'Amazing Developer'
            },
            servers: "http://localhost:3000"
        }
    },
    apis: ["app.js", ".routes/*.js"]
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));
*/

app.use(cors( {
  origin : "*",
  methods : ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
  allowedHeaders : 'Content-Type, Authorization, Origins, X-Requested-With, Accept, Access-Control-Allow-Origin'

}))
const productsRouter= require('./routes/products');
const usersRoute = require('./routes/users');
const ordersRoute = require('./routes/orders');



app.use('/api/products', productsRouter);
app.use('/api/users', usersRoute);
app.use('/api/orders', ordersRoute);


;/*
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});
*/
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
