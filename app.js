var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var file_io = require('./file_io.js');
var app = express();

var data = [];
var auth = file_io.read_json('pass.json');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(session({
  secret: 'linuz',
  resave: false,
  saveUninitialized: true
}));

//app.use(express.static(__dirname + '/public'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/fonts', express.static(__dirname + '/public/fonts'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/res', express.static(__dirname + '/public/res'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/get_json', function(req, res) {
  res.json(data);
});

app.post('/set_json', function(req, res) {
  console.log(req.body);
  data = req.body;
  res.send({status: "ok"});
});

app.get('/authenticated', function(req, res) {
  sess = req.session;
  var ret = {result: "fail"};
  if (sess.user)
    ret.result = "ok";
  res.send(ret);
});

app.post('/authentication', function(req, res) {
  sess = req.session;
  var ret = {result: "fail"};
  if (req.body.name in auth)
    if (auth[req.body.name].passhash == req.body.passhash){
      sess.user = req.body.name;
      ret.result = "ok";
    }
  res.send(ret);
});

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});