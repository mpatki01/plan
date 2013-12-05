var fs = require('fs');
var mkdirp = require('mkdirp');
var http = require('http');
var ProgressBar = require('progress');
var _target = './data/'; 
var _host = 'download.geonames.org';
var _path = '/export/dump/';
var _files = [
	'admin1CodesASCII.txt',
	'admin2Codes.txt',
	'iso-languagecodes.txt',
	'featureCodes_en.txt',
	'timeZones.txt',
	'countryInfo.txt',
	'alternateNames.zip',
	'allCountries.zip'
];
var _holder = {};
var _complete = true;

var download = function(name, options) {
    var file = fs.createWriteStream(_target + name);
    var req = http.request({
        host: _host, 
        port: 80, 
        path: _path + name
    });

    req.on('response', function(res){
      var len = parseInt(res.headers['content-length'], 10);
      var display = ' downloading ' + name + '\t\t[:bar] :percent :etas';
      var bar = new ProgressBar(display, {
          complete: '=', 
          incomplete: ' ', 
          width: 20, 
          total: len
      });

      res.on('data', function(data){
          file.write(data);
          bar.tick(data.length);
      });

      res.on('end', function(){
          file.end();
          _complete = true;
      });

    });

    req.end();
};

// Create the data directory if it doesn't exist.
mkdirp(_target, function(err) {
    if (err) {
        console.error(err);
    }
    var index = 0;
    var interval = setInterval(function() {
        if (_complete) {
            _complete = false;
            if (index == _files.length - 1) {
                process.exit(0);
            }
            else {
                download(_files[index]);
                index++;
            }
        }
    }, 100);
});
