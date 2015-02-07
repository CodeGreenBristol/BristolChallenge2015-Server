


var express = require('express');
var router = express.Router();

var url = require( "url" );
var queryString = require( "querystring" );
var request = require( "request" );

var file = "data/database.db";
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);
var bodyParser=require("body-parser");

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});


router.get('/getdata', function(req, res) {
    res.writeHead(200, {"Content-Type": "application/json"});
    db.all("SELECT * FROM points;", function(err,data) {
        console.log(data);
        res.end(JSON.stringify(data));
    });

    //res.end("test");
});

/* POST JSON. */
router.post('/post',bodyParser(), function(req, res){

console.log('Request received');

    res.writeHead(200, { 'Content-Type': 'application/json' });
    req.on('data', function (chunk) {
        console.log('GOT DATA!');
        //console.log(chunk.toString('utf8'));
	var json = JSON.parse(chunk.toString('utf8'));
	for(i in json){
	    var shape  = json[i];
	    for(j in shape){
		var point = shape[j];
		point.lat *= 20000;
		point.lat = Math.round(point.lat);
		point.lon *= 20000;
		point.lon = Math.round(point.lon);
	    }
	    console.log(shape);
	    var bla = p2m(shape);
	    console.log(bla);
	    console.log(bla.length);
	}

    });
    res.end('callback(\'{\"msg\": \"OK\"}\')');
});

function p2m(verts)
{
    var A = [];
    A.push(verts[0]);
    var t;
    for( var i = 0; i < A.length; i++)
    {
	// Y++
	
	t = new point(A[i].lat + 1, A[i].lon);
	if(!isMember(A, t) && pnpoly(verts, t))
	    {
		A.push(t);
		}
	
	// Y--
	t = new point(A[i].lat - 1, A[i].lon);
	if(!isMember(A, t) && pnpoly(verts, t))
	    {
		A.push(t);
		}
	
	// X++
	t = new point(A[i].lat, A[i].lon + 1);
	if(!isMember(A, t) && pnpoly(verts, t))
	    {
		A.push(t);
		}
	
	// X--
	t = new point(A[i].lat, A[i].lon - 1);
	if(!isMember(A, t) && pnpoly(verts, t))
	    {
		A.push(t);
		}
	
	// Y++ X++
	t = new point(A[i].lat + 1, A[i].lon + 1);
	if(!isMember(A, t) && pnpoly(verts, t))
	    {
		A.push(t);
		}
	
	// Y-- X--
	t = new point(A[i].lat - 1, A[i].lon - 1);
	if(!isMember(A, t) && pnpoly(verts, t))
	    {
		A.push(t);
		}
	
	// Y-- X++
	t = new point(A[i].lat - 1, A[i].lon + 1);
	if(!isMember(A, t) && pnpoly(verts, t))
	    {
		A.push(t);
		}
	
	// Y++ X--
	t = new point(A[i].lat + 1, A[i].lon - 1);
	if(!isMember(A, t) && pnpoly(verts, t))
	    {
		A.push(t);
		}
	}
    
    return A;
}

function isMember(A, p)
{
    for( var i = 0; i < A.length; i++)
	{
	    if(A[i].lat == p.lat && A[i].lon == p.lon)
		{
		    return true;
		    }
	    }
    return false;
}

function point(lat, lon)
{
    this.lat = lat;
    this.lon = lon;
}

function pnpoly(verts, test)
{
  var i, j, c = false;
  for (i = 0, j = verts.length - 1; i < verts.length; j = i++) 
      {
    if ( ( ( verts[i].lat > test.lat ) != ( verts[j].lat > test.lat ) ) &&
     ( test.lon < ( verts[j].lon - verts[i].lon ) * (test.lat - verts[i].lat) / 
        ( verts[j].lat - verts[i].lat ) + verts[i].lon ) )
	{
       c = !c;
	    }
  }
  return c;
}

module.exports = router;
