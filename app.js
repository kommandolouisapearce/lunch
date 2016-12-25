var express = require('express');
var mongo = require('mongodb');
var monk = require('monk');
var fs = require('fs');
//var db = monk('localhost:27017/nodetest2');
var bodyParser = require('body-parser');
var lunchbot = require('./bot');
var app = express();

/*app.use(function(req,res,next){ // Make our db accessible to our router
    req.db = db;
    next();
});*/

var token = fs.readFileSync("token", "utf-8")
var url =  fs.readFileSync("url", "utf-8")


var port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: true })); // body parser middleware
app.get('/', function (req, res) { res.status(200).send('Hello world!') }); // test route
app.post('/lunch', lunchbot(token, url));


// error handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(400).send(err.message);
});

app.listen(port, function () {
  console.log('Slack bot listening on port ' + port);
});
