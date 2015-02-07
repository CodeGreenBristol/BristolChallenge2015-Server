var express = require('express');
var router = express.Router();

var url = require( "url" );
var queryString = require( "querystring" );
var request = require( "request" );

var file = "data/database.db";
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});


router.get('/getdata', function(req, res) {
    res.writeHead(200, {"Content-Type": "text/plain"});
    db.all("SELECT * FROM points;", function(err,data) {
        console.log(data);
        res.end(JSON.stringify(data));
    });

    //res.end("test");
});

/* POST JSON. */
router.post('/post', function(req, res){

console.log('Request received');

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    req.on('data', function (chunk) {
        console.log('GOT DATA!');
        console.log(chunk.toString('utf8'));
    });
    res.end('callback(\'{\"msg\": \"OK\"}\')');
});



module.exports = router;
