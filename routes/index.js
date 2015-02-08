


var express = require('express');
var router = express.Router();

var url = require( "url" );
var queryString = require( "querystring" );
var request = require( "request" );
var mongoose = require('mongoose');


var bodyParser=require("body-parser");

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});


router.get('/getdata', function(req, res) {
    var mongo = require('mongodb');
    var monk = require('monk');

    var db = monk('localhost:27017/new');
    var collection = db.get('points');
    res.writeHead(200, {"Content-Type": "application/json"});
    collection.find({
//$or:[ {"weight_tree":{$gt: 2}},{"weight_flower":{$gt: 2}},{"weight_park":{$gt: 2}}]
}, function(err, docs) {
        res.end(JSON.stringify(docs));
        db.close();
    });

});

router.get('/drop', function(req, res) {
    var mongo = require('mongodb');
    var monk = require('monk');
    var db = monk('localhost:27017/new');
    var collection = db.get('points');
    collection.remove({});

    res.writeHead(200, {"Content-Type": "application/json"});
    res.end("test");
    db.close();

});

router.get('/adddata', function(req, res) {
    var mongo = require('mongodb');
    var monk = require('monk');
    var db = monk('localhost:27017/new');
    var collection = db.get('points');
    collection.insert(
    {
        "lat": 300,
        "lon": 300,
        "weight_tree": 400,
        "weight_flower": 500,
        "weight_park": 600}
    );

    res.writeHead(200, {"Content-Type": "application/json"});
    res.end("test");
    db.close();

});

/* POST JSON. */
router.post('/post',bodyParser(), function(req, res){

    console.log('Request received');
    var mongo = require('mongodb');
    var monk = require('monk');
    var db = monk('localhost:27017/new');
    var collection = db.get('points');
    req.on('data', function (chunk) {
        console.log('GOT DATA!');
        //console.log(chunk.toString('utf8'));
        var json = JSON.parse(chunk.toString('utf8'));
        for(i in json){
            var shape  = json[i];
                console.log(shape);
            for(j in shape.points){
                var point = shape.points[j];
                point.lat *= 10000;
                point.lat = Math.round(point.lat);
                point.lon *= 10000;
                point.lon = Math.round(point.lon);
            }
            console.log(shape);
            var allPoints = p2m(shape.points);
            //console.log(allPoints);
            console.log(allPoints.length);
            for(j in allPoints){
                point = allPoints[j];
                var wt=0;
              //  console.log(shape.type);
                if(shape.type==0) collection.update(
                {
                    "lat": point.lat,
                    "lon": point.lon
                },{
                    $inc: { weight_tree: 1 , weight_flower: 0 , weight_park: 0}
                },{
                    upsert: true
                });

                 if(shape.type==1)collection.update(
                {
                    "lat": point.lat,
                    "lon": point.lon
                },{
                    $inc: { weight_tree: 0 , weight_flower: 1 , weight_park: 0}
                },{
                    upsert: true
                });

                    if(shape.type==2)collection.update(
                {
                    "lat": point.lat,
                    "lon": point.lon
                },{
                    $inc: { weight_tree: 0 , weight_flower: 0 , weight_park: 1}
                },{
                    upsert: true
                });

            }
        }

    });
    res.writeHead(200, { 'Content-Type': 'application/json' });
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
