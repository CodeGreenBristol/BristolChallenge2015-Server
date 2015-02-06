var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

var fs = require("fs");
var file = "data/database.db";
var exists = fs.existsSync(file);

if(!exists) {
  console.log("Creating DB file.");
  fs.openSync(file, "w");
}

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);


if(!exists) {

    var sql_stmt = "CREATE TABLE points (" +
        "id INTEGER PRIMARY KEY, " +
        "lat REAL, " +
        "lon REAL, " +
        "weight REAL);";

    // we then execute the sql statement
    db.run(sql_stmt, function(err) {
        if(err) throw err;
        console.log("Table 'points' created");
        db.run('INSERT INTO points VALUES(0,2.32,3.5,4.7)');
    })
}


//var mongoose = require('mongoose');
// Connect to DB
/*mongoose.connect('mongodb://codegreen:bristolchallenge2015@ds041831.mongolab.com:41831/heroku_app33753543', function(err, db) {
  if(!err) {
    console.log("We are connected");
  }
  else console.log(err);
});*/

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
