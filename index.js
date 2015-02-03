var fs = require('fs');
var walk = require('fs-walk');

var files = [];

var _generate = function(readPath, writePath, readHiddenFiles) {
	readFiles(readPath, readHiddenFiles, function() {
		writeFile(writePath);
	});
};

var readFiles = function(path, readHiddenFiles, callback) {
	fs.exists(path, function (exists) {
		if(exists) {
			walk.walkSync(path, function(basedir, filename, stat, next) {
				if(!readHiddenFiles || filename.charAt(0) !== '.') {
					files.push(filename);	
				}
			}, function(err) {
			    if (err) console.error(err);
			});
			callback();
		} else {
			console.error("Path '" + path + "' does not exist!");
			process.exit(1);
		}
	});
};

var writeFile = function(path) {
	fs.writeFile(path, JSON.stringify(files), function(err) {
	    if(err) {
	        console.error(err);
	    } else {
	        console.log("Json file succefully generated!");
	    }
	});
};

// will take path from args if called from command line
if(process.argv[2] === '-exec') {
	if(process.argv[3]) {
		var readPath = process.argv[3];
		var writePath = process.argv[4] ? process.argv[4] : 'files.json';
		_generate(readPath, writePath);
	} else {
		console.error("Missing file path arg. Usage: node ./index.js -exec readPath writePath");
		process.exit(1);
	}
}

module.exports.generate = _generate;