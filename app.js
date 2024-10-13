require('dotenv').config();
const cors = require('cors');
const { runDailyTask } = require('./helpers/cronJob'); 
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
// var teknisiRouter = require('./routes/teknisi');
var {router: teknisiRouter } = require('./routes/teknisi'); // Ambil router
var {router: pelangganRouter} = require('./routes/pelanggan');
var {router: odpRouter} = require('./routes/odp');
// var odpRouter = require('./routes/odp');
var loginRouter = require('./routes/login');
var {router: tiketRouter} = require('./routes/tiket');
var app = express();

// Memanggil fungsi cron job
runDailyTask();

//use cors
app.use(cors());
  

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/pelanggan', pelangganRouter);
app.use('/admin', adminRouter);
app.use('/teknisi', teknisiRouter);
app.use('/odp', odpRouter);
app.use('/login',loginRouter);
app.use('/tiket',tiketRouter);



module.exports = app;

