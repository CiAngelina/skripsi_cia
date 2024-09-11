require('dotenv').config();
const cors = require('cors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var teknisiRouter = require('./routes/teknisi');
var sektorRouter = require('./routes/sektor');
var pelangganRouter = require('./routes/pelanggan');
var keahlianRouter = require('./routes/keahlian');
var keahlian_teknisiRouter = require('./routes/keahlian_teknisi');
var odpRouter = require('./routes/odp');
var loginRouter = require('./routes/login');
var tiketRouter = require('./routes/tiket');
var app = express();



//use cors
app.use(cors());
  

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/sektor', sektorRouter);
app.use('/pelanggan', pelangganRouter);
app.use('/admin', adminRouter);
app.use('/teknisi', teknisiRouter);
app.use('/admin', adminRouter);
app.use('/keahlian', keahlianRouter);
app.use('/keahlian_teknisi', keahlian_teknisiRouter);
app.use('/odp', odpRouter);
app.use('/login',loginRouter);
app.use('/tiket',tiketRouter);



module.exports = app;

