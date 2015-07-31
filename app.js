var express = require('express');
var app = express();
var https = require('https');
var bodyParser = require('body-parser');
var fs = require('fs');
var AWS = require('aws-sdk');
var bcrypt = require('bcryptjs');
var uuid = require('node-uuid');


//Setup Aws
AWS.config.region = 'us-west-2';

//Setup expressjs parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/dist', express.static('dist'));
app.use('/dist/pages', express.static('dist/pages'));
//Load routes for v1 xcloud
var repo = require('./v1/aws-repo.js')(AWS, bcrypt, uuid);
var services = require('./v1/services.js')(repo);
require('./routes-v1.js')(app, services);

//All extenions.


//Catchall for reverse engineering.
app.get('*', function(req, res){
    console.log('found url: ' + req.url);
    res.sendStatus(200);
});

app.post('*', function(req, res){
    console.log('found post: ' + req.url);
    res.sendStatus(201);
});

var options = {
    //Add SSL Info
}

console.log("Starting server :3082");
https.createServer(options, app).listen(3082);