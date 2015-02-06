var express = require('express');
var router = express.Router();

var url = require( "url" );
var queryString = require( "querystring" );
var request = require( "request" );

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
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
