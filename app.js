var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var crypto = require('crypto');
var file_io = require(__dirname + '//file_io.js');
var app = express();

var data = file_io.read_json(__dirname + '/task.json');
var auth = file_io.read_json(__dirname + '/pass.json');

var version = {app: "todo server", version: "0.1.3b"};

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

app.get('/version', function (req, res) {
  res.json(version);
});

app.get('/get_json', function(req, res) {
  res.json(data);
});

app.post('/set_json', function(req, res) {
  var ret = {status: "fail", msg: ""};
  console.log(req.body);
  if (req.session.user) {
    data = req.body;
    file_io.write_json(__dirname + '/task.json', data);
    ret = {status: "ok"};
  } else {
    ret.msg = "Not authenticated";
  }
  res.send(ret);
});

app.get('/authenticated', function(req, res) {
  //sess = req.session;
  var ret = {result: "fail", user: ""};
  if (req.session.user) {
    ret.result = "ok";
    ret.user = req.session.user;
  }
  res.send(ret);
});

app.post('/authentication', function(req, res) {
  sess = req.session;
  var ret = {result: "fail"};
  if (req.body.name in auth) {
    pass = crypto.pbkdf2Sync(req.body.passhash, auth[req.body.name].salt, 200, 256).toString();
    if (auth[req.body.name].passhash == pass){
      sess.user = req.body.name;
      ret.result = "ok";
    }
  }
  res.send(ret);
});

app.get('/log_out', function(req, res) {
  var ret = {result: "fail"};
  if (req.session.user) {
    delete req.session.user;
    ret.result = "ok";
  }
  res.send(ret);
});

app.post('/create_new_user', function(req, res) {
  var ret = {result: "fail", msg: "none"};
  if (req.body.name && req.body.passhash && req.body.email){
    if (!(req.body.name in auth)){
      var salt = crypto.randomBytes(256).toString();
      pass = crypto.pbkdf2Sync(req.body.passhash, salt, 200, 256).toString();
      auth[req.body.name] = {"email": req.body.email, "passhash": pass, "salt": salt};
      file_io.write_json(__dirname + '/pass.json', auth);
      ret.result = "ok";
    } else {
      ret.msg = "user already exist"
    }
  } else {
    ret.msg = "sended data is not correct"
  }
  res.send(ret);
});

app.get('/random', function(req, res) {
  var buf = crypto.randomBytes(256).toString();
  res.send(buf.toString());
});


var server = app.listen(80, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
