var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* POST JSON. */
router.post('/ReceiveJSON', function(req, res){
  res.send("ok");
});



module.exports = router;
