var fs = require('fs');


function read_json(file) {
  var s = fs.readFileSync(file, 'utf8');
  //console.log(s);
  return JSON.parse(s);
}

function write_json(file, data) {
  fs.writeFile(file, JSON.stringify(data), function (err) {
    if (err) throw err;
    return true;
  });
}

exports.read_json = function (file) {
  return read_json(file);
}

exports.write_json = function (file, data) {
  return write_json(file, data);
}